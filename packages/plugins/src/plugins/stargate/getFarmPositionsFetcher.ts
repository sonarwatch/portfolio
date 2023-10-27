import {
  PortfolioAssetToken,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { farmsKey, platformId } from './constants';
import { Cache } from '../../Cache';
import { userInfoAbi } from './abis';
import { getEvmClient } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { StgConfig } from './types';

export function getFarmsPositionsFetcher(config: StgConfig): Fetcher {
  const { farmsContract, networkId } = config;
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getEvmClient(networkId);
    const farms = await cache.getItem<`0x${string}`[]>(farmsKey, {
      prefix: platformId,
      networkId,
    });
    if (!farms) return [];

    const contracts = [];
    for (let i = BigInt(0); i < farms.length; i++) {
      contracts.push({
        address: farmsContract,
        abi: userInfoAbi,
        functionName: 'userInfo',
        args: [i, owner as `0x${string}`],
      } as const);
    }

    const results = await client.multicall({ contracts });

    const balances = results.map((res) =>
      res.status === 'failure' ? BigInt(0) : res.result[0]
    );
    if (!balances.some((value) => value !== BigInt(0))) return [];

    const lpTokenPrices = await cache.getTokenPrices(farms, networkId);
    if (!lpTokenPrices) return [];

    const farmsLiquidities: PortfolioLiquidity[] = [];
    for (let i = 0; i < balances.length; i++) {
      const lpTokenPrice = lpTokenPrices[i];
      if (
        !lpTokenPrice ||
        !lpTokenPrice.underlyings ||
        !lpTokenPrice.underlyings[0]
      )
        continue;

      const underlyingTokenPrice = lpTokenPrice.underlyings[0];

      const lpAmount = Number(balances[i]);
      if (lpAmount === 0) continue;

      const tokenAmount = lpAmount / 10 ** lpTokenPrice.decimals;

      const assets: PortfolioAssetToken[] = [
        tokenPriceToAssetToken(
          underlyingTokenPrice.address,
          tokenAmount,
          networkId,
          underlyingTokenPrice,
          underlyingTokenPrice.price
        ),
      ];
      const value = tokenAmount * underlyingTokenPrice.price;
      const liquidity: PortfolioLiquidity = {
        assets,
        assetsValue: value,
        value,
        yields: [],
        rewardAssets: [],
        rewardAssetsValue: null,
      };
      farmsLiquidities.push(liquidity);
    }

    if (farmsLiquidities.length === 0) return [];

    return [
      {
        networkId,
        platformId,
        label: 'Farming',
        type: PortfolioElementType.liquidity,
        data: {
          liquidities: farmsLiquidities,
        },
        value: getUsdValueSum(farmsLiquidities.map((a) => a.value)),
      },
    ];
  };
  return {
    executor,
    networkId,
    id: `${platformId}-${networkId}-${farmsKey}`,
  };
}
