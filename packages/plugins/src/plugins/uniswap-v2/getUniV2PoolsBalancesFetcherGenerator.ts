import {
  EvmNetworkIdType,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { pairsV2Key } from './constants';
import { FetcherExecutor } from '../../Fetcher';
import { getTokenAssets } from '../../utils/evm/getTokenAssets';
import upperCaseFirstLetter from '../../utils/misc/upperCaseFirstLetter';

export default function getUniV2PoolsBalancesFetcherGenerator(
  platformId: string,
  networkId: EvmNetworkIdType
): FetcherExecutor {
  const name = `${upperCaseFirstLetter(platformId)} V2`;
  return async (owner: string, cache: Cache) => {
    const pairsV2 = await cache.getItem<string[]>(pairsV2Key, {
      networkId,
      prefix: platformId,
    });
    if (!pairsV2) return [];

    const tokenAssets = await getTokenAssets(owner, pairsV2, networkId, cache);

    const liquidities = tokenAssets.map((assets): PortfolioLiquidity => {
      const value = getUsdValueSum(assets.map((a) => a.value));
      return {
        assets,
        assetsValue: value,
        rewardAssets: [],
        rewardAssetsValue: null,
        value,
        yields: [],
      };
    });

    if (liquidities.length === 0) return [];
    return [
      {
        type: PortfolioElementType.liquidity,
        label: 'LiquidityPool',
        networkId,
        platformId,
        value: getUsdValueSum(liquidities.map((l) => l.value)),
        name,
        data: {
          liquidities,
        },
      },
    ];
  };
}
