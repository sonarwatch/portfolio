import {
  PortfolioAssetToken,
  PortfolioAssetType,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  CrvNetworkId,
  crvNetworkIdBySwNetworkId,
  lpAddresesCachePrefix,
  platformId,
  poolsCachePrefix,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { erc20ABI } from '../../utils/evm/erc20Abi';
import { getEvmClient } from '../../utils/clients';
import { PoolDatum } from './getPoolsTypes';

const zero = BigInt(0);

export function getPoolsPositionFetcher(crvNetworkId: CrvNetworkId): Fetcher {
  const networkId = crvNetworkIdBySwNetworkId[crvNetworkId];
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const lpAddresses = await cache.getItem<string[]>(lpAddresesCachePrefix, {
      networkId,
      prefix: lpAddresesCachePrefix,
    });
    if (!lpAddresses) return [];

    const contracts = lpAddresses.map(
      (address) =>
        ({
          address: getAddress(address),
          abi: erc20ABI,
          functionName: 'balanceOf',
          args: [owner],
        } as const)
    );
    const client = getEvmClient(networkId);
    const balanceOfResults = await client.multicall({ contracts });

    const nonZeroAmounts: BigNumber[] = [];
    const nonZeroAddresses: string[] = [];
    balanceOfResults.forEach((r, i) => {
      if (r.status === 'failure') return;
      if ((r.result as bigint) === zero) return;
      nonZeroAmounts.push(new BigNumber((r.result as bigint).toString()));
      nonZeroAddresses.push(lpAddresses[i]);
    });

    const pools = await cache.getItems<PoolDatum>(nonZeroAddresses, {
      prefix: poolsCachePrefix,
      networkId,
    });

    const liquidities: PortfolioLiquidity[] = [];
    for (let i = 0; i < nonZeroAmounts.length; i++) {
      const amountRaw = nonZeroAmounts[i];
      const pool = pools[i];
      if (!pool) continue;

      const coins = pool.underlyingCoins || pool.coins;
      const supply = new BigNumber(pool.totalSupply);
      const shares = amountRaw.div(supply);
      const assets: PortfolioAssetToken[] = coins.map((coin) => {
        const amount = new BigNumber(coin.poolBalance)
          .times(shares)
          .div(10 ** Number(coin.decimals))
          .toNumber();
        return {
          networkId,
          type: PortfolioAssetType.token,
          data: {
            address: coin.address,
            amount,
            price: coin.usdPrice || null,
          },
          value: coin.usdPrice ? coin.usdPrice * amount : null,
        };
      });

      const value = getUsdValueSum(assets.map((a) => a.value));
      const liquidity: PortfolioLiquidity = {
        assets,
        assetsValue: value,
        value,
        yields: [],
        rewardAssets: [],
        rewardAssetsValue: null,
      };
      liquidities.push(liquidity);
    }
    const element: PortfolioElementLiquidity = {
      networkId,
      platformId,
      label: 'LiquidityPool',
      type: PortfolioElementType.liquidity,
      data: {
        liquidities,
      },
      value: getUsdValueSum(liquidities.map((a) => a.value)),
    };
    return [element];
  };
  return {
    executor,
    networkId,
    id: `${platformId}-${networkId}-pools`,
  };
}
