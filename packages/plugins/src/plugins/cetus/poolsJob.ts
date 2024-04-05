import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { clmmPoolsPrefix, createPoolEvent, platformId } from './constants';
import { getPoolFromObject } from './helpers';
import storeTokenPricesFromSqrt from '../../utils/clmm/tokenPricesFromSqrt';
import { ParsedJsonEvent } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { queryEvents } from '../../utils/sui/queryEvents';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const eventsData = await queryEvents<ParsedJsonEvent>(client, {
    MoveEventType: createPoolEvent,
  });

  const poolsAddresses = eventsData
    .map((eventData) =>
      eventData.parsedJson ? eventData.parsedJson.pool_id : []
    )
    .flat();

  const poolsObjects = await multiGetObjects(client, poolsAddresses);

  const promises = [];
  const cacheItems = [];
  for (const poolObject of poolsObjects) {
    const poolId = poolObject.data?.objectId;
    if (!poolId) continue;

    const pool = getPoolFromObject(poolObject);
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
  await cache.setItems(cacheItems, {
    prefix: clmmPoolsPrefix,
    networkId: NetworkId.sui,
  });
  await await Promise.all(promises);
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};
export default job;
