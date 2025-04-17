import BigNumber from 'bignumber.js';
import {
  NetworkId,
  formatMoveTokenAddress,
  isMoveTokenAddress,
  parseTypeString,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { lpCoinsTable, platformId } from './constants';
import { PoolFactory, PoolInfo } from './types';
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

  const pObjects = await multiGetObjects<PoolFactory>(client, poolFactoryIds);
  const poolsIds = pObjects
    .map((poolObject) =>
      poolObject.data?.content?.fields
        ? poolObject.data.content.fields.value
        : []
    )
    .flat();
  if (!poolsIds.length) return;

  const poolsInfo = await multiGetObjects<PoolInfo>(client, poolsIds);

  const mints = poolsInfo
    .map((pool) =>
      pool.data?.content?.fields?.type_names
        ? pool.data?.content?.fields?.type_names
            .map((type) => {
              if (isMoveTokenAddress(type)) {
                return formatMoveTokenAddress(type);
              }
              return [];
            })
            .flat()
        : []
    )
    .flat();
  const tokenPriceById = await cache.getTokenPricesAsMap(mints, networkId);

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
      let cAddress;

      if (isMoveTokenAddress(poolInfo.type_names[i])) {
        cAddress = formatMoveTokenAddress(poolInfo.type_names[i]);
      } else {
        return;
      }
      const tokenPrice = tokenPriceById.get(cAddress);

      if (!poolInfo.coin_decimals) return;

      poolUnderlyingsRaw.push({
        address: cAddress,
        decimals: poolInfo.coin_decimals[i],
        reserveAmountRaw: new BigNumber(nBalance).dividedBy(
          poolInfo.decimal_scalars[i]
        ),
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
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
