import {
  PortfolioAssetToken,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import { Cache } from '../../Cache';
import { platformId, poolsKey } from './constants';
import { balanceOfAbi } from './abis';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { StgConfig } from './types';

export function getPoolsPositionsFetcher(config: StgConfig): Fetcher {
  const { networkId } = config;
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getEvmClient(networkId);
    const poolsAddresses = await cache.getItem<`0x${string}`[]>(poolsKey, {
      prefix: platformId,
      networkId,
    });

    if (!poolsAddresses) return [];

    const contracts = poolsAddresses.map(
      (pool) =>
        ({
          address: pool,
          abi: balanceOfAbi,
          functionName: 'balanceOf',
          args: [owner as `0x${string}`],
        } as const)
    );

    const results = await client.multicall({ contracts });

    const balances = results.map((res) =>
      res.status === 'failure' ? BigInt(0) : res.result
    );
    if (!balances.some((value) => value !== BigInt(0))) return [];

    const tokenPrices = await cache.getTokenPrices(poolsAddresses, networkId);
    if (!tokenPrices) return [];

    const poolLiquidities: PortfolioLiquidity[] = [];
    for (let i = 0; i < balances.length; i++) {
      const tokenPrice = tokenPrices[i];
      if (!tokenPrice) continue;

      if (!tokenPrice.underlyings || !tokenPrice.underlyings[0]) continue;
      const underlyingTokenPrice = tokenPrice.underlyings[0];

      const balance = Number(balances[i]) / 10 ** underlyingTokenPrice.decimals;
      if (balance === 0) continue;

      const assets: PortfolioAssetToken[] = [
        tokenPriceToAssetToken(
          underlyingTokenPrice.address,
          Number(balance),
          networkId,
          underlyingTokenPrice,
          underlyingTokenPrice.price
        ),
      ];
      const value = Number(balance) * tokenPrice.price;
      const liquidity: PortfolioLiquidity = {
        assets,
        assetsValue: value,
        value,
        yields: [],
        rewardAssets: [],
        rewardAssetsValue: null,
      };
      poolLiquidities.push(liquidity);
    }

    if (poolLiquidities.length === 0) return [];

    return [
      {
        networkId,
        platformId,
        label: 'LiquidityPool',
        type: PortfolioElementType.liquidity,
        data: {
          liquidities: poolLiquidities,
        },
        value: getUsdValueSum(poolLiquidities.map((a) => a.value)),
      },
    ];
  };
  return {
    executor,
    networkId,
    id: `${platformId}-${networkId}-${poolsKey}`,
  };
}
