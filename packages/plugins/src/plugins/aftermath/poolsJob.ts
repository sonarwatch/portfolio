import { getObjectFields, getObjectId } from '@mysten/sui.js';
import BigNumber from 'bignumber.js';
import { NetworkId, TokenPriceUnderlying } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { lpCoinsTable, platformId } from './constants';
import { PoolInfo } from './types';
import { minimumLiquidity } from '../../utils/misc/computeAndStoreLpPrice';
import getMultipleSuiObjectsSafe from '../../utils/sui/getMultipleObjectsSafe';
import getDynamicFieldsSafe from '../../utils/sui/getDynamicFieldsSafe';
import { parseTypeString } from '../../utils/aptos';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import getLpUnderlyingTokenSource from '../../utils/misc/getLpUnderlyingTokenSource';
import getLpTokenSourceRaw from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const networkId = NetworkId.sui;
  const coinsTableFields = await getDynamicFieldsSafe(client, lpCoinsTable);

  const poolFactoryIds = coinsTableFields.map(getObjectId);
  if (!poolFactoryIds.length) return;

  const pObjects = await getMultipleSuiObjectsSafe(client, poolFactoryIds, {
    showContent: true,
  });

  const poolsIds = pObjects
    .map((poolObject) => {
      if (poolObject.data && poolObject.data.content) {
        const fields = getObjectFields(poolObject) as {
          id: { id: string };
          name: string;
          value: string;
        };
        if (fields.value) return fields.value;
      }
      return [];
    })
    .flat();
  if (!poolsIds.length) return;

  const poolsInfo = await getMultipleSuiObjectsSafe(client, poolsIds, {
    showContent: true,
  });

  const tokenPriceById = await getTokenPricesMap(
    poolsInfo
      .map((pool) =>
        pool.data ? (getObjectFields(pool) as PoolInfo).type_names : []
      )
      .flat()
      .map((type) => `0x${type}`),
    networkId,
    cache
  );

  for (const pool of poolsInfo) {
    if (!pool.data || !pool.data.content) continue;
    const poolInfo = getObjectFields(pool) as PoolInfo;

    if (poolInfo.lp_supply.fields.value === '0') continue;

    const moveType = parseTypeString(poolInfo.lp_supply.type);
    if (!moveType.keys) continue;

    const address = moveType.keys[0].type;
    if (poolInfo.normalized_balances.length > 2) {
      const totalTokens = poolInfo.normalized_balances.length;
      const mints = poolInfo.type_names.map((type) => `0x${type}`);
      const rawTokensPrices = await cache.getTokenPrices(mints, NetworkId.sui);
      if (!rawTokensPrices) continue;

      const tokensPrices = rawTokensPrices.filter(
        (tokenPrice) => tokenPrice !== undefined
      );
      if (tokensPrices.length === 0) continue;

      const tokenPriceRef = tokensPrices[0]?.price;
      if (!tokenPriceRef) continue;

      const decimals = poolInfo.lp_decimals;
      const poolSupply = new BigNumber(
        poolInfo.lp_supply.fields.value
      ).dividedBy(10 ** decimals);

      let totalLiquidity = new BigNumber(0);
      const underlyings: TokenPriceUnderlying[] = [];
      for (let i = 0; i < totalTokens; i++) {
        const coinDecimal = poolInfo.coin_decimals[i];
        const reserveAmount = new BigNumber(poolInfo.normalized_balances[i])
          .dividedBy(10 ** coinDecimal)
          .dividedBy(poolInfo.decimal_scalars[i]);
        const tokenLiquidity = reserveAmount.multipliedBy(tokenPriceRef);
        const amountPerLp = reserveAmount.dividedBy(poolSupply).toNumber();

        totalLiquidity = totalLiquidity.plus(tokenLiquidity);
        underlyings.push({
          address: mints[i],
          amountPerLp,
          decimals: coinDecimal,
          networkId,
          price: tokenPriceRef,
        });
      }

      if (totalLiquidity.isLessThan(minimumLiquidity)) continue;

      const price = totalLiquidity.dividedBy(poolSupply).toNumber();

      await cache.setTokenPriceSource({
        id: platformId,
        weight: 1,
        address,
        networkId,
        platformId,
        decimals,
        price,
        underlyings,
        timestamp: Date.now(),
      });
    } else {
      const tokenPriceA = tokenPriceById.get(`0x${poolInfo.type_names[0]}`);
      const tokenPriceB = tokenPriceById.get(`0x${poolInfo.type_names[1]}`);
      const reserveAmountRawA = new BigNumber(
        poolInfo.normalized_balances[0]
      ).dividedBy(poolInfo.decimal_scalars[0]);
      const reserveAmountRawB = new BigNumber(
        poolInfo.normalized_balances[1]
      ).dividedBy(poolInfo.decimal_scalars[1]);
      const underlyingSource = getLpUnderlyingTokenSource(
        address,
        platformId,
        networkId,
        {
          address: `0x${poolInfo.type_names[0]}`,
          decimals: poolInfo.coin_decimals[0],
          reserveAmountRaw: reserveAmountRawA,
          tokenPrice: tokenPriceA,
        },
        {
          address: `0x${poolInfo.type_names[1]}`,
          decimals: poolInfo.coin_decimals[1],
          reserveAmountRaw: reserveAmountRawB,
          tokenPrice: tokenPriceB,
        }
      );
      if (underlyingSource) await cache.setTokenPriceSource(underlyingSource);

      if (!tokenPriceA || !tokenPriceB) continue;

      const lpSource = getLpTokenSourceRaw(
        networkId,
        address,
        platformId,
        '',
        {
          address,
          decimals: poolInfo.lp_decimals,
          supplyRaw: new BigNumber(poolInfo.lp_supply.fields.value),
        },
        [
          {
            address: tokenPriceA.address,
            decimals: tokenPriceA.decimals,
            price: tokenPriceA.price,
            reserveAmountRaw: reserveAmountRawA,
          },
          {
            address: tokenPriceB.address,
            decimals: tokenPriceB.decimals,
            price: tokenPriceB.price,
            reserveAmountRaw: reserveAmountRawB,
          },
        ]
      );

      await cache.setTokenPriceSource(lpSource);
    }
  }
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};
export default job;
