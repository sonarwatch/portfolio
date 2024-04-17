import {
  EvmNetworkIdType,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getTokenAssets } from '../../utils/evm/getTokenAssets';
import { getPairKey } from './helpers';

export default function getPositionsV2Fetcher(
  networkId: EvmNetworkIdType,
  platformId: string,
  version: string
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const pairsV2 = await cache.getItem<string[]>(getPairKey(version), {
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
        name: version,
        data: {
          liquidities,
        },
      },
    ];
  };

  return {
    executor,
    id: `${platformId}-${networkId}-positions-${version.toLowerCase()}`,
    networkId,
  };
}
