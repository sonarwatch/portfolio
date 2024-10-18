import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { clmmPoolPackageId, clmmType, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import {
  buildPosition,
  extractStructTagFromType,
  fetchPosFeeAmount,
  fetchPosRewardersAmount,
  getPoolFromObject,
} from './helpers';

import { FetchPosRewardParams, Pool, Position } from './types';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const ownerRes = await getOwnedObjects(client, owner, {
    options: {
      showType: true,
      showContent: true,
      showDisplay: true,
      showOwner: true,
    },
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
  const poolsById: Map<string, Pool> = new Map();

  const poolsObjects = await multiGetObjects(client, [...new Set(poolsIds)]);
  poolsObjects.forEach((poolObj) => {
    if (poolObj.data?.content?.fields) {
      const pool = getPoolFromObject(poolObj);
      poolsById.set(poolObj.data.objectId, pool);
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

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(clmmPosition.liquidity),
      pool.current_tick_index,
      clmmPosition.tick_lower_index,
      clmmPosition.tick_upper_index,
      false
    );

    const element = elementRegistry.addElementLiquidity({
      label: 'LiquidityPool',
      tags: ['Concentrated'],
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
  id: `${platformId}-clmms`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
