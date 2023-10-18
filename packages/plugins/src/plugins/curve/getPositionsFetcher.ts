import {
  PortfolioAssetToken,
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
  platformId,
  poolsByAddressPrefix,
  poolsCachePrefix,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import { PoolDatum } from './getPoolsTypes';
import { balanceOfAbI } from './abis';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { zeroBigInt } from '../../utils/misc/constants';

export function getPositionsFetcher(crvNetworkId: CrvNetworkId): Fetcher {
  const networkId = crvNetworkIdBySwNetworkId[crvNetworkId];
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const poolsByAddress = await cache.getItem<{
      [k: string]: string;
    }>(poolsByAddressPrefix, {
      networkId,
      prefix: poolsByAddressPrefix,
    });
    if (!poolsByAddress) return [];

    const addresses = Object.keys(poolsByAddress);
    const contracts = addresses.map(
      (address) =>
        ({
          address: getAddress(address),
          abi: balanceOfAbI,
          functionName: 'balanceOf',
          args: [owner],
        } as const)
    );
    const client = getEvmClient(networkId);
    const balanceOfResults = await client.multicall({ contracts });

    const poolAddresses: Set<string> = new Set();
    const balanceOfByAddress: Map<string, BigNumber> = new Map();
    balanceOfResults.forEach((r, i) => {
      if (r.status === 'failure') return;
      if ((r.result as bigint) === zeroBigInt) return;
      const address = addresses[i];
      const poolAddress = poolsByAddress[address];
      if (!poolAddress) return;

      balanceOfByAddress.set(
        address,
        new BigNumber((r.result as bigint).toString())
      );
      poolAddresses.add(poolAddress);
    });
    if (balanceOfByAddress.size === 0) return [];

    const poolAddressesArray = Array.from(poolAddresses);
    const pools = await cache.getItems<PoolDatum>(poolAddressesArray, {
      prefix: poolsCachePrefix,
      networkId,
    });
    const poolDatumByAddress: Map<string, PoolDatum> = new Map();
    pools.forEach((pool, i) => {
      if (!pool) return;
      poolDatumByAddress.set(poolAddressesArray[i], pool);
    });

    const poolLiquidities: PortfolioLiquidity[] = [];
    const gaugeLiquidities: PortfolioLiquidity[] = [];
    for (const [address, balance] of balanceOfByAddress) {
      const poolAddress = poolsByAddress[address];
      if (!poolAddress) continue;
      const pool = poolDatumByAddress.get(poolAddress);
      if (!pool) continue;

      const coins = pool.underlyingCoins || pool.coins;
      const supply = new BigNumber(pool.totalSupply);
      const shares = balance.div(supply);
      const assets: PortfolioAssetToken[] = coins
        .map((coin) => {
          const amount = new BigNumber(coin.poolBalance)
            .times(shares)
            .div(10 ** Number(coin.decimals))
            .toNumber();
          const tokenPrice = pool.coinsTokenPrices[coin.address];
          return tokenPriceToAssetTokens(
            coin.address,
            amount,
            networkId,
            tokenPrice,
            coin.usdPrice || undefined
          );
        })
        .flat();

      const value = getUsdValueSum(assets.map((a) => a.value));
      const liquidity: PortfolioLiquidity = {
        assets,
        assetsValue: value,
        value,
        yields: [],
        rewardAssets: [],
        rewardAssetsValue: null,
      };
      const isGauge = pool.gaugeAddress === address;
      if (isGauge) gaugeLiquidities.push(liquidity);
      else poolLiquidities.push(liquidity);
    }

    const elements: PortfolioElementLiquidity[] = [];
    if (poolLiquidities.length !== 0) {
      const element: PortfolioElementLiquidity = {
        networkId,
        platformId,
        label: 'LiquidityPool',
        type: PortfolioElementType.liquidity,
        data: {
          liquidities: poolLiquidities,
        },
        value: getUsdValueSum(poolLiquidities.map((a) => a.value)),
      };
      elements.push(element);
    }
    if (gaugeLiquidities.length !== 0) {
      const element: PortfolioElementLiquidity = {
        networkId,
        platformId,
        label: 'Farming',
        type: PortfolioElementType.liquidity,
        data: {
          liquidities: gaugeLiquidities,
        },
        value: getUsdValueSum(gaugeLiquidities.map((a) => a.value)),
      };
      elements.push(element);
    }
    return elements;
  };
  return {
    executor,
    networkId,
    id: `${platformId}-${networkId}-positions`,
  };
}
