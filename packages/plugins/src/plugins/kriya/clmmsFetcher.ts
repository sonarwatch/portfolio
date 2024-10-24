import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { clmmType, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
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

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(clmmPosition.liquidity),
      bitsToNumber(pool.tick_index.fields.bits),
      bitsToNumber(clmmPosition.tick_lower_index.fields.bits),
      bitsToNumber(clmmPosition.tick_upper_index.fields.bits),
      false
    );

    const element = elementRegistry.addElementLiquidity({
      label: 'LiquidityPool',
      tags: ['Concentrated'],
    });
    const liquidity = element.addLiquidity();

    liquidity.addAsset({
      address: pool.type_x.fields.name,
      amount: tokenAmountA,
    });

    liquidity.addAsset({
      address: pool.type_y.fields.name,
      amount: tokenAmountB,
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
