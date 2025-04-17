import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import {
  clmmPoolsPrefix,
  firstPool,
  hardCodedPools,
  platformId,
  poolParentId,
} from './constants';
import { getPoolFromObject } from './helpers';
import storeTokenPricesFromSqrt from '../../utils/clmm/tokenPricesFromSqrt';
import { TablePoolInfo } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const promises = [];
  const cacheItems = [];

  const poolsAddresses: Set<string> = new Set(hardCodedPools);
  let poolInfo;
  let value;
  do {
    if (!poolInfo) {
      value = firstPool;
    } else {
      value = poolInfo.data?.content?.fields.value.fields.next;
    }

    poolInfo = await getDynamicFieldObject<TablePoolInfo>(client, {
      parentId: poolParentId,
      name: {
        type: '0x2::object::ID',
        value,
      },
    });

    if (poolInfo.data?.content)
      poolsAddresses.add(
        poolInfo.data.content.fields.value.fields.value.fields.pool_id
      );
  } while (poolInfo && poolInfo.data?.content?.fields.value.fields.next);

  const poolsObjects = await multiGetObjects(client, [...poolsAddresses]);

  let poolId;
  let pool;
  for (let i = 0; i < poolsObjects.length; i++) {
    poolId = poolsObjects[i].data?.objectId;
    if (!poolId) continue;

    pool = getPoolFromObject(poolsObjects[i]);
    if (!pool) continue;

    promises.push(
      storeTokenPricesFromSqrt(
        cache,
        NetworkId.sui,
        pool.poolAddress,
        new BigNumber(pool.coinAmountA),
        new BigNumber(pool.coinAmountB),
        new BigNumber(pool.current_sqrt_price),
        pool.coinTypeA,
        pool.coinTypeB
      )
    );
    cacheItems.push({
      key: poolId,
      value: pool,
    });
  }

  // always use getPools helper to retrieve cetus pools
  await cache.setItems(cacheItems, {
    prefix: clmmPoolsPrefix,
    networkId: NetworkId.sui,
  });

  await Promise.all(promises);
};

const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
