import BigNumber from 'bignumber.js';
import { NetworkId, formatTokenAddress } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { lpCoinsTable, platformId } from './constants';
import { PoolInfo } from './types';
import { parseTypeString } from '../../utils/aptos';
import getLpUnderlyingTokenSourceOld from '../../utils/misc/getLpUnderlyingTokenSourceOld';
import getLpTokenSourceRawOld, {
  PoolUnderlyingRaw,
} from '../../utils/misc/getLpTokenSourceRawOld';
import { getDynamicFields } from '../../utils/sui/getDynamicFields';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';

const networkId = NetworkId.sui;

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const coinsTableFields = await getDynamicFields(client, lpCoinsTable);

  const poolFactoryIds = coinsTableFields.map((f) => f.objectId);
  if (!poolFactoryIds.length) return;

  const pObjects = await multiGetObjects(client, poolFactoryIds);
  const poolsIds = pObjects
    .map((poolObject) => {
      if (poolObject.data?.content?.fields) {
        const fields = poolObject.data?.content?.fields as {
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

  const poolsInfo = await multiGetObjects<PoolInfo>(client, poolsIds);

  const tokenPriceById = await cache.getTokenPricesAsMap(
    poolsInfo
      .map((pool) => pool.data?.content?.fields?.type_names || [])
      .flat(),
    networkId
  );

  const sources = [];
  for (const pool of poolsInfo) {
    if (!pool.data?.content?.fields) continue;
    const poolInfo = pool.data?.content?.fields;
    if (poolInfo.lp_supply.fields.value === '0') continue;

    const moveType = parseTypeString(poolInfo.lp_supply.type);
    if (!moveType.keys) continue;
    const lpAddress = moveType.keys[0].type;
    const poolUnderlyingsRaw: PoolUnderlyingRaw[] = [];
    poolInfo.normalized_balances.forEach((nBalance, i) => {
      const caddress = formatTokenAddress(
        `0x${poolInfo.type_names[i]}`,
        networkId
      );
      const tokenPrice = tokenPriceById.get(caddress);
      if (!tokenPrice) return;
      poolUnderlyingsRaw.push({
        address: caddress,
        decimals: poolInfo.coin_decimals[i],
        reserveAmountRaw: new BigNumber(
          poolInfo.normalized_balances[i]
        ).dividedBy(poolInfo.decimal_scalars[i]),
        price: tokenPrice.price,
      });
    });
    if (poolUnderlyingsRaw.length !== poolInfo.normalized_balances.length)
      continue;
    const lpSource = getLpTokenSourceRawOld(
      networkId,
      platformId,
      platformId,
      {
        address: lpAddress,
        decimals: poolInfo.lp_decimals,
        supplyRaw: poolInfo.lp_supply.fields.value,
      },
      poolUnderlyingsRaw
    );
    sources.push(lpSource);
    if (poolInfo.normalized_balances.length === 2) {
      const underlyingSource = getLpUnderlyingTokenSourceOld(
        lpAddress,
        networkId,
        {
          address: `0x${poolInfo.type_names[0]}`,
          decimals: poolInfo.coin_decimals[0],
          reserveAmountRaw: new BigNumber(
            poolInfo.normalized_balances[0]
          ).dividedBy(poolInfo.decimal_scalars[0]),
          tokenPrice: tokenPriceById.get(
            formatTokenAddress(`0x${poolInfo.type_names[0]}`, networkId)
          ),
          weight: new BigNumber(poolInfo.weights[0]).div(10 ** 18).toNumber(),
        },
        {
          address: `0x${poolInfo.type_names[1]}`,
          decimals: poolInfo.coin_decimals[1],
          reserveAmountRaw: new BigNumber(
            poolInfo.normalized_balances[1]
          ).dividedBy(poolInfo.decimal_scalars[1]),
          tokenPrice: tokenPriceById.get(
            formatTokenAddress(`0x${poolInfo.type_names[1]}`, networkId)
          ),
          weight: new BigNumber(poolInfo.weights[1]).div(10 ** 18).toNumber(),
        }
      );
      if (underlyingSource) sources.push(underlyingSource);
    }
  }
  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};
export default job;
