import {
  EvmNetworkIdType,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  formatEvmTokenAddress,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { PoolData } from './types';
import { getBalances } from '../yearn/helpers';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { poolsKey } from './constants';

export default function getPoolsBalancesFetcher(
  networkId: EvmNetworkIdType,
  platformId: string
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const pools = await cache.getItem<PoolData[]>(poolsKey, {
      prefix: platformId,
      networkId,
    });
    if (!pools) return [];

    const balances = await getBalances(
      networkId,
      pools.map((pool) => pool.gaugeAddress),
      owner
    );
    if (balances.length === 0) return [];

    const lpAddresses = pools.map((pool) =>
      formatEvmTokenAddress(pool.gaugeAddress)
    );
    const lpTokensPrices = await cache.getTokenPrices(lpAddresses, networkId);
    const lpPriceById: Map<string, TokenPrice> = new Map();
    lpTokensPrices.forEach((lpTP) =>
      lpTP ? lpPriceById.set(lpTP.address, lpTP) : []
    );

    const liquidities: PortfolioLiquidity[] = [];
    for (let index = 0; index < balances.length; index++) {
      const balance = balances[index];
      if (balance > BigInt(0)) {
        const poolData = pools[index];
        const lpTokenPrice = lpPriceById.get(
          formatEvmTokenAddress(poolData.gaugeAddress)
        );
        console.log(
          'constexecutor:FetcherExecutor= ~ poolData.gaugeAddress:',
          poolData.gaugeAddress
        );
        console.log(
          'constexecutor:FetcherExecutor= ~ lpTokenPrice:',
          lpTokenPrice
        );
        if (!lpTokenPrice) continue;

        const amount = new BigNumber(balance.toString())
          .dividedBy(new BigNumber(10).pow(lpTokenPrice.decimals))
          .toNumber();
        console.log('constexecutor:FetcherExecutor= ~ amount:', amount);

        const assets = tokenPriceToAssetTokens(
          poolData.gaugeAddress,
          amount,
          networkId,
          lpTokenPrice
        );
        const assetsValue = getUsdValueSum(assets.map((a) => a.value));

        const liquidity = {
          assets,
          assetsValue,
          rewardAssets: [],
          rewardAssetsValue: null,
          value: assetsValue,
          yields: [],
        };

        liquidities.push(liquidity);
      }
    }

    if (liquidities.length === 0) return [];

    return [
      {
        type: PortfolioElementType.liquidity,
        label: 'LiquidityPool',
        networkId,
        platformId,
        value: getUsdValueSum(liquidities.map((l) => l.value)),
        data: {
          liquidities,
        },
      },
    ];
  };

  return {
    networkId,
    executor,
    id: `${platformId}-${networkId}-pools`,
  };
}
