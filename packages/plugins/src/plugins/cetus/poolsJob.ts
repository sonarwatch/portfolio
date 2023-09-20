import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { clmmPoolsPrefix, createPoolEvent, platformId } from './constants';
import { getPoolFromObject } from './helpers';
import storeTokenPricesFromSqrt from '../../utils/clmm/tokenPricesFromSqrt';
import { ParsedJsonEvent } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const eventsData = [];
  let resp;
  let cursor;
  do {
    resp = await client.queryEvents({
      query: {
        MoveEventType: createPoolEvent,
      },
      cursor,
    });
    cursor = resp.nextCursor;
    if (resp.data.length > 0) eventsData.push(...resp.data);
  } while (resp.hasNextPage);

  const poolsAddresses = eventsData
    .map((eventData) =>
      eventData.parsedJson
        ? (eventData.parsedJson as ParsedJsonEvent).pool_id
        : []
    )
    .flat();

  const poolsObjects = [];
  for (let i = 0; i < poolsAddresses.length / 50; i++) {
    const addresses = poolsAddresses.slice(i * 50, i * 50 + 50);
    const tempObjects = await client.multiGetObjects({
      ids: addresses,
      options: { showContent: true, showType: true },
    });
    poolsObjects.push(...tempObjects);
  }

  for (const poolObject of poolsObjects) {
    const poolId = poolObject.data?.objectId;
    if (!poolId) continue;

    const pool = getPoolFromObject(poolObject);
    if (!pool) continue;

    await storeTokenPricesFromSqrt(
      cache,
      NetworkId.sui,
      pool.poolAddress,
      new BigNumber(pool.coinAmountA),
      new BigNumber(pool.coinAmountB),
      new BigNumber(pool.current_sqrt_price),
      pool.coinTypeA,
      pool.coinTypeB
    );

    await cache.setItem(poolId, pool, {
      prefix: clmmPoolsPrefix,
      networkId: NetworkId.sui,
    });
  }
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
