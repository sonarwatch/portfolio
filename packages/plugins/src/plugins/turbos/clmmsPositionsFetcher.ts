import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  clmmPoolsPrefix,
  clmmNftType,
  packageIdOriginal,
  platformId,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { NFTFields, Pool, PositionFields } from './types';
import { formatForNative } from './helper';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const nftsPositionsRes = await getOwnedObjectsPreloaded(client, owner, {
    filter: { Package: packageIdOriginal },
  });
  if (nftsPositionsRes.length === 0) return [];

  const clmmPoolsIds: string[] = [];
  const clmmPositionsIds: string[] = [];
  const nftPositionByPositionId: Map<string, NFTFields> = new Map();
  for (let i = 0; i < nftsPositionsRes.length; i++) {
    const nftData = nftsPositionsRes[i].data;
    if (!nftData) continue;

    if (nftData.type !== clmmNftType) continue;
    if (!nftData.content) continue;

    const nftPositionFields = nftData.content.fields as NFTFields;
    clmmPoolsIds.push(nftPositionFields.pool_id);
    clmmPositionsIds.push(nftPositionFields.position_id);
    nftPositionByPositionId.set(
      nftPositionFields.position_id,
      nftPositionFields
    );
  }
  if (clmmPositionsIds.length === 0) return [];

  const pools = await cache.getItems<Pool>(clmmPoolsIds, {
    prefix: clmmPoolsPrefix,
    networkId: NetworkId.sui,
  });
  const poolsById: Map<string, Pool> = new Map();
  pools.forEach((pool) => {
    if (pool) {
      poolsById.set(pool.objectId, pool);
    }
  });

  const clmmPositionsRes = await multiGetObjects<PositionFields>(
    client,
    clmmPositionsIds
  );

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);
  for (let i = 0; i < clmmPositionsRes.length; i++) {
    const clmmPosition = clmmPositionsRes[i].data?.content?.fields;
    if (!clmmPosition) continue;
    const nftPosition = nftPositionByPositionId.get(clmmPosition.id.id);
    if (!nftPosition) continue;

    const pool = poolsById.get(nftPosition.pool_id);
    if (!pool) continue;

    // TODO : améliorer le problème du 0x000002::sui::SUI + manque de 0x
    const element = elementRegistry.addElementConcentratedLiquidity();
    element.setLiquidity({
      addressA: formatForNative(`0x${nftPosition.coin_type_a.fields.name}`),
      addressB: formatForNative(`0x${nftPosition.coin_type_b.fields.name}`),
      liquidity: clmmPosition.liquidity,
      tickCurrentIndex: bitsToNumber(pool.tick_current_index.fields.bits),
      tickLowerIndex: bitsToNumber(clmmPosition.tick_lower_index.fields.bits),
      tickUpperIndex: bitsToNumber(clmmPosition.tick_upper_index.fields.bits),
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-clmms-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
