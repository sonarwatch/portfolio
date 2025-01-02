import { NetworkId, parseTypeString } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { lpPositionTypeV2, platformId } from './constants';
import { getClientSui } from '../../utils/clients';

import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { LpTokenV2, Pool, ExtendedPool } from './types/pools';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const lpObjects = await getOwnedObjectsPreloaded<LpTokenV2>(client, owner, {
    filter: { StructType: lpPositionTypeV2 },
  });
  if (!lpObjects) return [];

  const poolsIds: Set<string> = new Set();
  const positions: LpTokenV2[] = [];
  lpObjects.forEach((position) => {
    if (position.data?.content?.fields) {
      poolsIds.add(position.data.content.fields.pool_id);
      positions.push(position.data.content.fields);
    }
  });

  const poolsById: Map<string, ExtendedPool> = new Map();
  const poolsObjects = await multiGetObjects<Pool>(client, [
    ...new Set(poolsIds),
  ]);
  poolsObjects.forEach((poolObj) => {
    if (poolObj.data?.content?.fields) {
      const { keys } = parseTypeString(poolObj.data.type);
      if (!keys) return;

      poolsById.set(poolObj.data.objectId, {
        ...poolObj.data.content.fields,
        token_x_mint: keys[0].type,
        token_y_mint: keys[1].type,
      });
    }
  });

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  positions.forEach((position) => {
    const pool = poolsById.get(position.pool_id);
    if (!pool) return;

    const shares = new BigNumber(position.lsp.fields.balance).dividedBy(
      pool.lsp_supply.fields.value
    );

    const tokenAmountX = shares.times(pool.token_x);
    const tokenAmountY = shares.times(pool.token_y);

    const element = elementRegistry.addElementLiquidity({
      label: 'LiquidityPool',
    });
    const liquidity = element.addLiquidity();

    liquidity.addAsset({
      address: pool.token_x_mint,
      amount: tokenAmountX,
    });

    liquidity.addAsset({
      address: pool.token_y_mint,
      amount: tokenAmountY,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-pools-v2`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
