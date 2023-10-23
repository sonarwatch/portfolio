import {
  EvmNetworkIdType,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId, poolsV2CacheKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getTokenAssets } from '../../utils/evm/getTokenAssets';

function getPoolsV2Fetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const poolAddresses = await cache.getItem<string[]>(poolsV2CacheKey, {
      prefix: platformId,
      networkId,
    });
    if (!poolAddresses) return [];
    const assetss = await getTokenAssets(
      owner,
      poolAddresses,
      networkId,
      cache
    );
    const liquidities: PortfolioLiquidity[] = assetss.map((assets) => {
      const value = getUsdValueSum(assets.map((a) => a.value));
      return {
        assets,
        assetsValue: getUsdValueSum(assets.map((a) => a.value)),
        rewardAssets: [],
        rewardAssetsValue: null,
        value,
        yields: [],
      };
    });
    return [
      {
        type: PortfolioElementType.liquidity,
        label: 'LiquidityPool',
        networkId,
        platformId,
        value: 1,
        name: 'Balancer V2',
        data: {
          liquidities,
        },
      },
    ];
  };

  return {
    id: `${platformId}-${networkId}-pools-v2`,
    networkId,
    executor,
  };
}
export default getPoolsV2Fetcher;
