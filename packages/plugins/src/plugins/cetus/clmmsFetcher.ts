import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { clmmPoolPackageId, clmmType, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import {
  buildPosition,
  extractStructTagFromType,
  fetchPosFeeAmount,
  fetchPosRewardersAmount,
} from './helpers';

import { FetchPosRewardParams, Pool, PoolStat, Position } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getPools } from './getPools';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const ownerRes = await getOwnedObjectsPreloaded(client, owner, {
    filter: { Package: clmmPoolPackageId },
  });
  if (ownerRes.length === 0) return [];

  const clmmPositions: Position[] = [];
  for (let i = 0; i < ownerRes.length; i++) {
    const clmmPositionRes = ownerRes[i];
    if (!clmmPositionRes.data || !clmmPositionRes.data.type) continue;
    const type = extractStructTagFromType(clmmPositionRes.data.type);
    if (type.full_address === clmmType) {
      const position = buildPosition(clmmPositionRes);
      clmmPositions.push(position);
    }
  }
  if (clmmPositions.length === 0) return [];

  const poolsIds = clmmPositions.map((position) => position.pool);
  const poolsById: Map<string, Pool & PoolStat> = new Map();

  const poolsObjects = await getPools([...new Set(poolsIds)], cache);
  poolsObjects.forEach((pool) => {
    if (pool) {
      poolsById.set(pool.poolAddress, pool);
    }
  });

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  const [allFees, allRewards] = await Promise.all([
    fetchPosFeeAmount(
      clmmPositions.map((clmmPosition) => ({
        poolAddress: clmmPosition.pool,
        positionId: clmmPosition.pos_object_id,
        coinTypeA: clmmPosition.coin_type_a,
        coinTypeB: clmmPosition.coin_type_b,
      }))
    ),
    fetchPosRewardersAmount(
      clmmPositions
        .map((clmmPosition) => {
          if (!clmmPosition) return null;
          const pool = poolsById.get(clmmPosition.pool);
          if (!pool) return null;
          return {
            poolAddress: clmmPosition.pool,
            positionId: clmmPosition.pos_object_id,
            coinTypeA: clmmPosition.coin_type_a,
            coinTypeB: clmmPosition.coin_type_b,
            rewarderInfo: pool.rewarder_infos,
          };
        })
        .filter((v) => v !== null) as FetchPosRewardParams[]
    ),
  ]);

  clmmPositions.forEach((clmmPosition, i) => {
    const pool = poolsById.get(clmmPosition.pool);
    if (!pool) return;

    const fees = allFees[i];
    const rewards = allRewards[i];

    const element = elementRegistry.addElementConcentratedLiquidity();

    const liquidity = element.setLiquidity({
      addressA: pool.coinTypeA,
      addressB: pool.coinTypeB,
      liquidity: clmmPosition.liquidity,
      tickCurrentIndex: pool.current_tick_index,
      tickLowerIndex: clmmPosition.tick_lower_index,
      tickUpperIndex: clmmPosition.tick_upper_index,
      poolLiquidity: pool.liquidity,
      currentSqrtPrice: pool.current_sqrt_price,
      feeRate: Number(pool.fee_rate) / 10000,
      swapVolume24h: pool.vol_in_usd_24h,
    });

    liquidity.addRewardAsset({
      address: pool.coinTypeA,
      amount: fees.feeOwedA,
    });

    liquidity.addRewardAsset({
      address: pool.coinTypeB,
      amount: fees.feeOwedB,
    });

    rewards.rewarderAmountOwed.forEach((rewarderAmountOwed) => {
      liquidity.addRewardAsset({
        address: rewarderAmountOwed.coin_address,
        amount: rewarderAmountOwed.amount_owed,
      });
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
