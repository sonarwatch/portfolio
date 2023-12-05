import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { clmmPoolsPrefix, createPoolEvent, platformId } from './constants';
import { getPoolFromObject } from './helpers';
import storeTokenPricesFromSqrt from '../../utils/clmm/tokenPricesFromSqrt';
import { ParsedJsonEvent } from './types';
import getMultipleSuiObjectsSafe from '../../utils/sui/getMultipleObjectsSafe';
import queryEventsSafe from '../../utils/sui/queryEventSafe';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const eventsData = await queryEventsSafe(client, {
    MoveEventType: createPoolEvent,
  });

  const poolsAddresses = eventsData
    .map((eventData) =>
      eventData.parsedJson
        ? (eventData.parsedJson as ParsedJsonEvent).pool_id
        : []
    )
    .flat();

  const poolsObjects = await getMultipleSuiObjectsSafe(client, poolsAddresses, {
    showContent: true,
    showType: true,
  });

  const promises = [];

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

    promises.push(
      cache.setItem(poolId, pool, {
        prefix: clmmPoolsPrefix,
        networkId: NetworkId.sui,
      })
    );
  }
  await Promise.allSettled(promises);
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
