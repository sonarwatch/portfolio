import {
  formatMoveTokenAddress, getUsdValueSum,
  NetworkId, PortfolioElementType, PortfolioLiquidity
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  packageIdV3,
  platformId,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { PoolV3, PositionV3Object } from './types';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import {
  getTokenAmountsFromLiquidity
} from '../../utils/clmm/tokenAmountFromLiquidity';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { asIntN } from '../cetus/helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const positions = await getOwnedObjects<PositionV3Object>(client, owner, {
    filter: {
      StructType: `${packageIdV3}::position::Position`,
    },
  });
  if (positions.length === 0) return [];

  const poolsIds = new Set<string>();
  const mints = new Set<string>();

  positions.forEach((position) => {
    if (position?.data?.content?.fields.coin_type_x.fields.name) {
      const token = formatMoveTokenAddress(position.data.content.fields.coin_type_x.fields.name);
      mints.add(token);
    }
    if (position?.data?.content?.fields.coin_type_y.fields.name) {
      const token = formatMoveTokenAddress(position.data.content.fields.coin_type_y.fields.name);
      mints.add(token);
    }
    if (position.data?.content?.fields.pool_id)
      poolsIds.add(position.data?.content?.fields.pool_id)
  })

  const [tokenPrices, pools] = await Promise.all([
    cache.getTokenPricesAsMap(
      [...mints],
      NetworkId.sui
    ),
    multiGetObjects<PoolV3>(client, Array.from(poolsIds.values()))
  ]);

  const liquidities: PortfolioLiquidity[] = [];
  positions.forEach((position) => {
    if (position.data?.content?.fields.liquidity && position.data?.content?.fields.pool_id) {
      const pool = pools.find(p => p.data?.objectId === position.data?.content?.fields.pool_id)
      const tokenPriceX = tokenPrices.get(formatMoveTokenAddress(position.data.content.fields.coin_type_x.fields.name));
      const tokenPriceY = tokenPrices.get(formatMoveTokenAddress(position.data.content.fields.coin_type_y.fields.name));

      if (pool?.data?.content?.fields && tokenPriceX && tokenPriceY) {
        const tokenAmounts = getTokenAmountsFromLiquidity(
          new BigNumber(position.data?.content?.fields.liquidity),
          asIntN(BigInt(pool?.data?.content?.fields.tick_index.fields.bits)),
          asIntN(BigInt(position.data?.content?.fields.tick_lower_index.fields.bits)),
          asIntN(BigInt(position.data?.content?.fields.tick_upper_index.fields.bits)),
          false
        )

        const assetX = tokenPriceToAssetToken(
          tokenPriceX.address,
          tokenAmounts.tokenAmountA.dividedBy(10 ** tokenPriceX.decimals).toNumber(),
          NetworkId.sui,
          tokenPriceX
        );

        const assetY = tokenPriceToAssetToken(
          tokenPriceY.address,
          tokenAmounts.tokenAmountB.dividedBy(10 ** tokenPriceY.decimals).toNumber(),
          NetworkId.sui,
          tokenPriceY
        );

        const value = getUsdValueSum([assetX.value, assetY.value]);

        liquidities.push({
          assets: [assetX, assetY],
          assetsValue: value,
          rewardAssets: [],
          rewardAssetsValue: null,
          value,
          yields: [],
        });
      }
    }
  });

  if (liquidities.length === 0) return [];

  return [
    {
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.sui,
      platformId,
      label: 'LiquidityPool',
      value: getUsdValueSum(liquidities.map((a) => a.value)),
      data: {
        liquidities,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking-pool-v3`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
