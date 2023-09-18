import { DynamicFieldPage, getObjectFields, getObjectId } from '@mysten/sui.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { clmmPoolsPrefix, platformId, poolTableId } from './constants';
import { getClientSui } from '../../utils/clients';
import { parsePool } from './helper';
import storeTokenPricesFromSqrt from '../../utils/clmm/tokenPricesFromSqrt';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const poolFactories: DynamicFieldPage = await client.getDynamicFields({
    parentId: poolTableId,
  });
  const poolFactoryIds = poolFactories.data.map(getObjectId);
  if (!poolFactoryIds.length) return;

  const poolFactoryInfos = await client.multiGetObjects({
    ids: poolFactoryIds,
    options: { showContent: true },
  });

  const poolIds = poolFactoryInfos.map((info) => {
    const fields = getObjectFields(info) as {
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
  const pools = await client.multiGetObjects({
    ids: poolIds,
    options: { showContent: true },
  });

  for (const pool of pools) {
    const parsedPool = parsePool(pool);
    const { types } = parsedPool;
    if (
      types.length > 2 &&
      !types[0].includes('fee') &&
      !types[1].includes('fee')
    ) {
      await storeTokenPricesFromSqrt(
        cache,
        NetworkId.sui,
        parsedPool.id.id,
        new BigNumber(parsedPool.coin_a),
        new BigNumber(parsedPool.coin_b),
        new BigNumber(parsedPool.sqrt_price),
        types[0],
        types[1]
      );
    }
  }

  const promises = pools.map((pool) => {
    const parsedPool = parsePool(pool);
    return cache.setItem(parsedPool.objectId, parsedPool, {
      prefix: clmmPoolsPrefix,
      networkId: NetworkId.sui,
    });
  });
  await Promise.allSettled(promises);
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
