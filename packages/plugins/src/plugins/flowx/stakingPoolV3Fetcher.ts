import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { packageIdV3, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { PoolV3, PositionV3Object } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const positions = await getOwnedObjectsPreloaded<PositionV3Object>(
    client,
    owner,
    {
      filter: {
        StructType: `${packageIdV3}::position::Position`,
      },
    }
  );
  if (positions.length === 0) return [];

  const poolsIds = new Set<string>();
  const mints = new Set<string>();
  positions.forEach((position) => {
    if (position?.data?.content?.fields.coin_type_x.fields.name)
      mints.add(position.data.content.fields.coin_type_x.fields.name);
    if (position?.data?.content?.fields.coin_type_y.fields.name)
      mints.add(position.data.content.fields.coin_type_y.fields.name);
    if (position.data?.content?.fields.pool_id)
      poolsIds.add(position.data?.content?.fields.pool_id);
  });

  const pools = await multiGetObjects<PoolV3>(
    client,
    Array.from(poolsIds.values())
  );

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  positions.forEach((position) => {
    if (!position.data?.content?.fields.liquidity) return;
    if (!position.data?.content?.fields.pool_id) return;

    const pool = pools.find(
      (p) => p.data?.objectId === position.data?.content?.fields.pool_id
    );
    if (!pool?.data?.content?.fields) return;

    const element = elementRegistry.addElementConcentratedLiquidity();

    element.setLiquidity({
      addressA: position.data.content.fields.coin_type_x.fields.name,
      addressB: position.data.content.fields.coin_type_y.fields.name,
      liquidity: position.data?.content?.fields.liquidity,
      tickCurrentIndex: bitsToNumber(
        pool?.data?.content?.fields.tick_index.fields.bits
      ),
      tickLowerIndex: bitsToNumber(
        position.data?.content?.fields.tick_lower_index.fields.bits
      ),
      tickUpperIndex: bitsToNumber(
        position.data?.content?.fields.tick_upper_index.fields.bits
      ),
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking-pool-v3`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
