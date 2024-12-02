import { NetworkId, parseTypeString } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, supplyPoolsCacheKey, vaults } from './constants';
import { getClientSui } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { Position, PositionCap, PositionConfig, SupplyPool } from './types';
import { clmmType } from '../cetus/constants';
import { Pool } from '../cetus/types';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { calcDebtByShares, calcEquityValues } from './helpers';
import { ObjectResponse } from '../../utils/sui/types';
import { getPools } from '../cetus/getPools';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const positionCaps = await getOwnedObjectsPreloaded<PositionCap>(
    client,
    owner,
    {
      filter: {
        StructType:
          '0x51e0ccce48f0763f98f1cb4856847c2e1531adacada99cdd7626ab999db57523::position_core_clmm::PositionCap',
      },
    }
  );
  if (positionCaps.length === 0) return [];

  const positions = await multiGetObjects<Position>(
    client,
    positionCaps
      .map((p) => p.data?.content?.fields.position_id)
      .filter((s) => s !== undefined) as string[]
  );

  if (positionCaps.length === 0) return [];

  const [pools, configs, supplyPools] = await Promise.all([
    getPools(
      positions
        .map(
          (position) => position.data?.content?.fields.lp_position.fields.pool
        )
        .filter((s) => s !== null) as string[],
      cache
    ).then((res) => res.filter((p) => p !== null) as Pool[]),
    multiGetObjects<PositionConfig>(
      client,
      positions
        .map((p) => p.data?.content?.fields.config_id)
        .filter((s) => s !== null) as string[]
    ),
    cache.getItem<ObjectResponse<SupplyPool>[]>(supplyPoolsCacheKey, {
      prefix: platformId,
      networkId: NetworkId.sui,
    }),
  ]);

  if (!supplyPools) return [];

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  for (const position of positions) {
    const i = positions.indexOf(position);
    if (!position.data?.content) continue;

    const parsedTypeString = parseTypeString(position.data.type);
    const isCetus =
      parsedTypeString.keys && parsedTypeString.keys[2].type === clmmType;

    if (!isCetus) continue;
    const pool = pools[i];
    if (!pool) continue;
    const config = configs[i];
    if (!config?.data?.content) continue;

    const vaultInfo = vaults.find(
      (v) => v.poolObjectId === config.data?.content?.fields.pool_object_id
    );
    if (!vaultInfo) continue;

    const supplyPoolX = supplyPools.find(
      (s) => s.data?.content?.fields.id.id === vaultInfo.supplyPoolXInfo
    );
    const supplyPoolY = supplyPools.find(
      (s) => s.data?.content?.fields.id.id === vaultInfo.supplyPoolYInfo
    );
    if (!supplyPoolX || !supplyPoolY) continue;

    const element = elementRegistry.addElementLiquidity({
      label: 'Leverage',
      name: vaultInfo.name,
    });
    const liquidity = element.addLiquidity();

    const tickLowerIndex = bitsToNumber(
      position.data.content.fields.lp_position.fields.tick_lower_index.fields
        .bits
    );
    const tickUpperIndex = bitsToNumber(
      position.data.content.fields.lp_position.fields.tick_upper_index.fields
        .bits
    );

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(position.data.content.fields.lp_position.fields.liquidity),
      pool.current_tick_index,
      tickLowerIndex,
      tickUpperIndex,
      false
    );

    const debtX = new BigNumber(
      calcDebtByShares(
        config.data.content.fields.lend_facil_cap.fields.id.id,
        supplyPoolX,
        Number(
          position.data.content?.fields.debt_bag.fields.inner.fields.infos.find(
            (db) => `0x${db.fields.asset_type.fields.name}` === pool.coinTypeA
          )?.fields.amount || 0
        )
      )
    );

    const debtY = new BigNumber(
      calcDebtByShares(
        config.data.content.fields.lend_facil_cap.fields.id.id,
        supplyPoolY,
        Number(
          position.data.content?.fields.debt_bag.fields.inner.fields.infos.find(
            (db) => `0x${db.fields.asset_type.fields.name}` === pool.coinTypeB
          )?.fields.amount || 0
        )
      )
    );

    const { x, y } = calcEquityValues(
      debtX,
      debtY,
      tokenAmountA.plus(position.data.content.fields.col_x),
      tokenAmountB.plus(position.data.content.fields.col_y),
      new BigNumber(pool.current_sqrt_price)
        .pow(2)
        .div(new BigNumber(2).pow(128))
    );

    liquidity.addAsset({
      address: pool.coinTypeA,
      amount: x,
    });

    liquidity.addAsset({
      address: pool.coinTypeB,
      amount: y,
    });

    if (tokenAmountA.isZero() || tokenAmountB.isZero())
      element.addTag('Out Of Range');
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-lpvaults`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
