import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { clmmPoolsPrefix, platformId, poolTableId } from './constants';
import { getClientSui } from '../../utils/clients';
import { parsePool } from './helper';
import storeTokenPricesFromSqrt from '../../utils/clmm/tokenPricesFromSqrt';
import { getDynamicFields } from '../../utils/sui/getDynamicFields';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { PoolFields } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const poolFactories = await getDynamicFields(client, poolTableId);
  const poolFactoryIds = poolFactories.map((p) => p.objectId);
  if (!poolFactoryIds.length) return;

  const poolFactoryInfos = await multiGetObjects(client, poolFactoryIds, {
    showContent: true,
  });

  const poolIds = poolFactoryInfos.map((info) => {
    const fields = info.data?.content?.fields as {
      value: {
        fields: {
          pool_id: string;
          pool_key: string;
        };
      };
    };
    return fields.value.fields.pool_id;
  });

  if (!poolIds.length) return;
  const pools = await multiGetObjects<PoolFields>(client, poolIds);
  const promises = [];
  for (const pool of pools) {
    const parsedPool = parsePool(pool);
    const { types } = parsedPool;
    if (
      types.length > 2 &&
      !types[0].includes('fee') &&
      !types[1].includes('fee')
    ) {
      promises.push(
        storeTokenPricesFromSqrt(
          cache,
          NetworkId.sui,
          parsedPool.id.id,
          new BigNumber(parsedPool.coin_a),
          new BigNumber(parsedPool.coin_b),
          new BigNumber(parsedPool.sqrt_price),
          types[0],
          types[1]
        )
      );
      promises.push(
        cache.setItem(parsedPool.objectId, parsedPool, {
          prefix: clmmPoolsPrefix,
          networkId: NetworkId.sui,
        })
      );
    }
  }
  await Promise.allSettled(promises);
};

const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
