import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { clmmType, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { ClmmPosition, ClmmPool } from './types/pools';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const ownerRes = await getOwnedObjects<ClmmPosition>(client, owner, {
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

  const poolsObjects = await multiGetObjects<ClmmPool>(client, [
    ...new Set(poolsIds),
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
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-clmms`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
