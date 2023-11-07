import {
  NetworkId,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { pairsV2Key } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from '../uniswap/constants';
import { getTokenAssets } from '../../utils/evm/getTokenAssets';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const pairsV2 = await cache.getItem<string[]>(pairsV2Key, {
    networkId: NetworkId.ethereum,
    prefix: platformId,
  });
  if (!pairsV2) return [];

  const tokenAssets = await getTokenAssets(
    owner,
    pairsV2,
    NetworkId.ethereum,
    cache
  );

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
      networkId: NetworkId.ethereum,
      platformId,
      value: getUsdValueSum(liquidities.map((l) => l.value)),
      name: 'Uniswap V2',
      data: {
        liquidities,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-v2`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
