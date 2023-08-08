import {
  NetworkId,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  clmmPoolPackageId,
  clmmPoolsPrefix,
  clmmType,
  platformId,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { buildPosition, extractStructTagFromType } from './helpers';

import { Pool, Position } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const ownerRes = await client.getOwnedObjects({
    owner,
    options: {
      showType: true,
      showContent: true,
      showDisplay: true,
      showOwner: true,
    },
    filter: { Package: clmmPoolPackageId },
  });
  if (!ownerRes.data) return [];

  const clmmPositions: Position[] = [];
  for (let i = 0; i < ownerRes.data.length; i++) {
    const clmmPositionRes = ownerRes.data[i];
    if (!clmmPositionRes.data || !clmmPositionRes.data.type) continue;
    const type = extractStructTagFromType(clmmPositionRes.data.type);
    if (type.full_address === clmmType) {
      const position = buildPosition(clmmPositionRes);
      clmmPositions.push(position);
    }
  }

  const poolsIds = clmmPositions.map((position) => position.pool);
  const pools = await cache.getItems<Pool>(poolsIds, {
    prefix: clmmPoolsPrefix,
    networkId: NetworkId.sui,
  });
  const poolsById: Map<string, Pool> = new Map();
  pools.forEach((pool) => {
    if (pool) {
      poolsById.set(pool.poolAddress, pool);
    }
  });
  if (poolsById.size === 0) return [];

  const assets: PortfolioLiquidity[] = [];
  let totalLiquidityValue = 0;
  for (const clmmPosition of clmmPositions) {
    const pool = poolsById.get(clmmPosition.pool);
    if (!pool) continue;

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(clmmPosition.liquidity).toNumber(),
      pool.current_tick_index,
      clmmPosition.tick_lower_index,
      clmmPosition.tick_upper_index,
      0
    );

    const tokenPriceA = await cache.getTokenPrice(
      pool.coinTypeA,
      NetworkId.sui
    );
    if (!tokenPriceA) continue;

    const assetTokenA = tokenPriceToAssetToken(
      pool.coinTypeA,
      tokenAmountA / 10 ** tokenPriceA.decimals,
      NetworkId.sui,
      tokenPriceA
    );
    const tokenPriceB = await cache.getTokenPrice(
      pool.coinTypeB,
      NetworkId.sui
    );
    if (!tokenPriceB) continue;

    const assetTokenB = tokenPriceToAssetToken(
      pool.coinTypeB,
      tokenAmountB / 10 ** tokenPriceB.decimals,
      NetworkId.sui,
      tokenPriceB
    );
    if (
      !assetTokenA ||
      !assetTokenB ||
      assetTokenA.value === null ||
      assetTokenB.value === null
    )
      continue;
    const value = assetTokenA.value + assetTokenB.value;
    assets.push({
      assets: [assetTokenA, assetTokenB],
      assetsValue: value,
      rewardAssets: [],
      rewardAssetsValue: 0,
      value,
      yields: [],
    });
    totalLiquidityValue += value;
  }
  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.sui,
      platformId,
      label: 'LiquidityPool',
      tags: ['Concentrated'],
      value: totalLiquidityValue,
      data: {
        liquidities: assets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-clmms`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
