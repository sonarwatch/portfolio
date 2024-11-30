import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { clmmPoolPositionType, clmmsPoolsKey, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { ClmmPool, ClmmPoolStat, ClmmPosition } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ObjectResponse } from '../../utils/sui/types';
import { getAccruedFeeAndRewards } from './helpers';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const poolsMemo = new MemoizedCache<
  (ObjectResponse<ClmmPool> & { stats?: ClmmPoolStat })[]
>(clmmsPoolsKey, {
  prefix: platformId,
  networkId: NetworkId.sui,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const objects = await getOwnedObjectsPreloaded<ClmmPosition>(client, owner, {
    filter: {
      StructType: clmmPoolPositionType,
    },
  });
  if (objects.length === 0) return [];

  const pools = await poolsMemo.getItem(cache);

  if (!pools) return [];

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  for (const clmmPosition of objects) {
    if (!clmmPosition.data?.content) continue;
    const pool = pools.find(
      (p) =>
        p?.data?.content?.fields.id.id ===
        clmmPosition.data?.content?.fields.pool_id
    );
    if (!pool || !pool.data?.content) continue;

    const feesAndRewards = await getAccruedFeeAndRewards(
      clmmPosition.data.content.fields.coin_type_a,
      clmmPosition.data.content.fields.coin_type_b,
      pool.data.content.fields.id.id,
      clmmPosition.data.content.fields.id.id,
      pool.data.content.fields.reward_infos.map(
        (r) => r.fields.reward_coin_type
      ),
      owner
    );

    const element = elementRegistry.addElementConcentratedLiquidity();

    const liquidity = element.setLiquidity({
      addressA: clmmPosition.data.content.fields.coin_type_a,
      addressB: clmmPosition.data.content.fields.coin_type_b,
      liquidity: clmmPosition.data.content.fields.liquidity,
      tickCurrentIndex: bitsToNumber(
        pool.data.content.fields.current_tick_index.fields.bits
      ),
      tickLowerIndex: bitsToNumber(
        clmmPosition.data.content.fields.lower_tick.fields.bits
      ),
      tickUpperIndex: bitsToNumber(
        clmmPosition.data.content.fields.upper_tick.fields.bits
      ),
      currentSqrtPrice: pool.data.content.fields.current_sqrt_price,
      poolLiquidity: pool.data.content.fields.liquidity,
      feeRate: Number(pool.data.content.fields.fee_rate) / 10000,
      swapVolume24h: pool.stats?.day.volume,
    });

    liquidity.addRewardAsset({
      address: clmmPosition.data.content.fields.coin_type_a,
      amount: feesAndRewards?.fee?.coinA,
    });

    liquidity.addRewardAsset({
      address: clmmPosition.data.content.fields.coin_type_b,
      amount: feesAndRewards?.fee?.coinB,
    });

    pool.data.content.fields.reward_infos.forEach((reward, i) => {
      liquidity.addRewardAsset({
        address: reward.fields.reward_coin_type,
        amount: feesAndRewards?.rewards[i],
      });
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-clmms`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
