import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { clmmType, poolsV3StatsInfoKey, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { ClmmPosition, ClmmPool, PoolStat } from './types/pools';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const ownerRes = await getOwnedObjectsPreloaded<ClmmPosition>(client, owner, {
    filter: { StructType: clmmType },
  });
  if (ownerRes.length === 0) return [];

  const clmmPositions: ClmmPosition[] = [];
  for (let i = 0; i < ownerRes.length; i++) {
    const position = ownerRes[i].data?.content?.fields;
    if (position) clmmPositions.push(position);
  }
  if (clmmPositions.length === 0) return [];

  const poolsIds = clmmPositions.map((position) => position.pool_id);
  const poolsById: Map<string, ClmmPool> = new Map();

  const [poolsObjects, poolsStats] = await Promise.all([
    multiGetObjects<ClmmPool>(client, [...new Set(poolsIds)]),
    cache.getItem<PoolStat[]>(poolsV3StatsInfoKey, {
      prefix: platformId,
      networkId: NetworkId.sui,
    }),
  ]);
  poolsObjects.forEach((poolObj) => {
    if (poolObj.data?.content?.fields) {
      poolsById.set(poolObj.data.objectId, poolObj.data?.content?.fields);
    }
  });

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  clmmPositions.forEach((clmmPosition) => {
    const pool = poolsById.get(clmmPosition.pool_id);
    if (!pool) return;

    const element = elementRegistry.addElementConcentratedLiquidity();

    element.setLiquidity({
      addressA: pool.type_x.fields.name,
      addressB: pool.type_y.fields.name,
      liquidity: clmmPosition.liquidity,
      tickCurrentIndex: bitsToNumber(pool.tick_index.fields.bits),
      tickLowerIndex: bitsToNumber(clmmPosition.tick_lower_index.fields.bits),
      tickUpperIndex: bitsToNumber(clmmPosition.tick_upper_index.fields.bits),
      currentSqrtPrice: pool.sqrt_price,
      poolLiquidity: pool.liquidity,
      feeRate: Number(pool.swap_fee_rate) / 10000,
      swapVolume24h: (poolsStats || []).find(
        (p) => p.poolId === clmmPosition.pool_id
      )?.volume24h,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-pools-v3`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
