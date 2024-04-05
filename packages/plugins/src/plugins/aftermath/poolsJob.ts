import BigNumber from 'bignumber.js';
import { NetworkId, formatTokenAddress } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { lpCoinsTable, platformId } from './constants';
import { PoolInfo } from './types';
import { parseTypeString } from '../../utils/aptos';
import { getDynamicFields } from '../../utils/sui/getDynamicFields';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import {
  PoolUnderlyingRaw,
  getLpTokenSourceRaw,
} from '../../utils/misc/getLpTokenSourceRaw';

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
        tokenPrice,
        weight: new BigNumber(poolInfo.weights[i]).div(10 ** 18).toNumber(),
      });
    });
    if (poolUnderlyingsRaw.length !== poolInfo.normalized_balances.length)
      continue;
    const lpSources = getLpTokenSourceRaw({
      networkId,
      platformId,
      lpDetails: {
        address: lpAddress,
        decimals: poolInfo.lp_decimals,
        supplyRaw: poolInfo.lp_supply.fields.value,
      },
      sourceId: lpAddress,
      poolUnderlyingsRaw,
      priceUnderlyings: true,
    });
    sources.push(...lpSources);
  }
  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};
export default job;
