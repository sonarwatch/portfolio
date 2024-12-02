import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { farmNftType, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import {
  WrappedPositionNFT,
  Pool,
  Farm,
  FetchPosFeeParams,
  FetchPosRewardParams,
} from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { fetchPosFeeAmount, fetchPosRewardersAmount } from './helpers';
import { getPools } from './getPools';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const positions = await getOwnedObjectsPreloaded<WrappedPositionNFT>(
    client,
    owner,
    {
      filter: {
        StructType: farmNftType,
      },
    }
  );
  if (positions.length === 0) return [];

  const [farms, pools, allFees] = await Promise.all([
    multiGetObjects<Farm>(
      client,
      positions
        .map((position) => position.data?.content?.fields.pool_id)
        .filter((s) => s !== null) as string[]
    ),
    getPools(
      positions
        .map(
          (position) => position.data?.content?.fields.clmm_postion.fields.pool
        )
        .filter((s) => s !== null) as string[],
      cache
    ).then((res) => res.filter((p) => p !== null) as Pool[]),
    fetchPosFeeAmount(
      positions
        .map((position) => {
          const clmmPosition =
            position.data?.content?.fields.clmm_postion.fields;
          if (!clmmPosition) return null;
          return {
            poolAddress: clmmPosition.pool,
            positionId: clmmPosition.id.id,
            coinTypeA: clmmPosition.coin_type_a.fields.name,
            coinTypeB: clmmPosition.coin_type_b.fields.name,
          };
        })
        .filter((v) => v !== null) as FetchPosFeeParams[]
    ),
  ]);

  const allRewards = await fetchPosRewardersAmount(
    positions
      .map((position) => {
        const clmmPosition = position.data?.content?.fields.clmm_postion.fields;
        if (!clmmPosition) return null;
        const pool = pools.find((p) => p.poolAddress === clmmPosition.pool);
        if (!pool) return null;
        return {
          poolAddress: clmmPosition.pool,
          positionId: clmmPosition.id.id,
          coinTypeA: clmmPosition.coin_type_a.fields.name,
          coinTypeB: clmmPosition.coin_type_b.fields.name,
          rewarderInfo: pool.rewarder_infos,
        };
      })
      .filter((v) => v !== null) as FetchPosRewardParams[]
  );

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  positions.forEach((position, i) => {
    if (!position.data?.content?.fields) return;

    const farm = farms.find(
      (f) => f.data?.objectId === position.data?.content?.fields.pool_id
    );
    if (!farm || !farm.data?.content?.fields.effective_tick_lower) return;

    const pool = pools.find(
      (p) =>
        p.poolAddress ===
        position.data?.content?.fields.clmm_postion.fields.pool
    );
    if (!pool) return;

    const fees = allFees[i];
    const rewards = allRewards[i];

    const tickLowerIndex = bitsToNumber(
      position.data.content.fields.clmm_postion.fields.tick_lower_index.fields
        .bits
    );
    const tickUpperIndex = bitsToNumber(
      position.data.content.fields.clmm_postion.fields.tick_upper_index.fields
        .bits
    );
    const effectiveTickLower = bitsToNumber(
      farm.data.content.fields.effective_tick_lower.fields.bits
    );
    const effectiveTickUpper = bitsToNumber(
      farm.data.content.fields.effective_tick_upper.fields.bits
    );

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(position.data.content.fields.clmm_postion.fields.liquidity),
      pool.current_tick_index,
      tickLowerIndex < effectiveTickLower ? effectiveTickLower : tickLowerIndex,
      tickUpperIndex < effectiveTickUpper ? tickUpperIndex : effectiveTickUpper,
      false
    );

    if (tokenAmountA.isZero() && tokenAmountB.isZero()) return;

    const element = elementRegistry.addElementLiquidity({
      label: 'Farming',
    });
    const liquidity = element.addLiquidity();

    liquidity.addAsset({
      address: pool.coinTypeA,
      amount: tokenAmountA,
    });

    liquidity.addAsset({
      address: pool.coinTypeB,
      amount: tokenAmountB,
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

    if (tokenAmountA.isZero() || tokenAmountB.isZero())
      element.addTag('Out Of Range');
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
