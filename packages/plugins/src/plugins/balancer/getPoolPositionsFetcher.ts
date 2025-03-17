import BigNumber from 'bignumber.js';
import {
  PortfolioAssetToken,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';

import { BalancerSupportedEvmNetworkIdType, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getPoolPositionsForOwner } from './helpers/pools';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';

import { Cache } from '../../Cache';
import { getOwnerBalRewards } from './helpers/gauges';
import { getOwnerGaugeRewards } from '../curve/helpers/gauges';

function getPoolPositionsFetcher(
  networkId: BalancerSupportedEvmNetworkIdType
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const ownerPoolPositions = await getPoolPositionsForOwner(owner, networkId);

    if (ownerPoolPositions.length === 0) return [];

    // Process all positions in parallel
    const lpAndFarmingPositionResults = await Promise.all(
      ownerPoolPositions.map(async (poolPosition) => {
        const ownerShares = new BigNumber(
          poolPosition.userBalance.totalBalance
        );
        const totalPoolShares = new BigNumber(
          poolPosition.dynamicData.totalShares
        );

        const assets: PortfolioAssetToken[] = poolPosition.poolTokens
          .flatMap((poolToken) => {
            const poolTokenBalance = new BigNumber(poolToken.balance);
            const poolTokenBalanceUSD = new BigNumber(poolToken.balanceUSD);
            const poolTokenPrice =
              poolTokenBalanceUSD.dividedBy(poolTokenBalance);

            const usersShareOfPoolToken = ownerShares
              .dividedBy(totalPoolShares)
              .multipliedBy(poolTokenBalance);

            return tokenPriceToAssetTokens(
              poolToken.address,
              usersShareOfPoolToken.toNumber(),
              networkId,
              null,
              poolTokenPrice.toNumber()
            );
          })
          /**
           * @see https://balancer.gitbook.io/balancer-v2/products/balancer-pools/composable-stable-pools
           * Balancer's composable stable pools include the BPT tokens in the poolTokens array.
           * When doing the calculations they are needed, but they are not displayed on the UI
           * So we are removing them from the poolTokens array, after all the calculations are done
           * The BPT tokens have the same address as the pool, and the type of the pool will be 'COMPOSABLE_STABLE'
           */
          .filter(
            (asset) =>
              asset.data.address.toLowerCase() !==
              poolPosition.address.toLowerCase() // pool address is not check summed
          );

        const summedValue = getUsdValueSum(assets.map((a) => a.value));
        const stakedBalance = poolPosition.userBalance.stakedBalances[0];

        // Liquidity Pool Position
        if (!stakedBalance) {
          return {
            type: 'pool',
            liquidity: {
              assets,
              assetsValue: summedValue,
              value: summedValue,
              yields: [],
              rewardAssets: [],
              rewardAssetsValue: null,
            },
          };
        }

        // Farming Position
        if (stakedBalance.stakingType === 'GAUGE') {
          const { gaugeAddress } = poolPosition.staking.gauge;

          const [balRewardsRaw, rewardTokensRaw] = await Promise.all([
            getOwnerBalRewards(networkId, owner, gaugeAddress),
            getOwnerGaugeRewards(networkId, owner, gaugeAddress),
          ]);

          const allRewardTokensWithBalance = [
            balRewardsRaw,
            ...rewardTokensRaw,
          ].filter((token) => token.balance.isGreaterThan(0));

          const tokenPrices = await Promise.all(
            allRewardTokensWithBalance.map((token) =>
              cache.getTokenPrice(token.address, networkId)
            )
          );

          const allRewardTokenWithBalanceAndPrice =
            allRewardTokensWithBalance.map((token, index) => ({
              ...token,
              tokenPrice: tokenPrices[index],
            }));

          const rewardAssets: PortfolioAssetToken[] =
            allRewardTokenWithBalanceAndPrice.flatMap((rewardAsset) => {
              // Could add a safety check here so if the token price doesn't exist we fetch the decimal from the contract?
              const balance = rewardAsset.balance.dividedBy(
                new BigNumber(10).pow(rewardAsset?.tokenPrice?.decimals || 18)
              );
              return tokenPriceToAssetTokens(
                rewardAsset.address,
                balance.toNumber(),
                networkId,
                rewardAsset.tokenPrice,
                rewardAsset.tokenPrice?.price || undefined
              );
            });

          const rewardAssetsValue = getUsdValueSum(
            rewardAssets.map((a) => a.value)
          );

          return {
            type: 'gauge',
            liquidity: {
              assets,
              assetsValue: summedValue,
              value: summedValue,
              yields: [],
              rewardAssets,
              rewardAssetsValue,
            },
          };
        }

        // TODO suuport locked positions
        // if (stakedBalance.stakingType === 'VEBAL') {
        // This is not available on fraxtal
        // need to query contract for unlock time
        // }

        // TODO aura staking - they appear under aura finance on debank?
        // if (stakedBalance.stakingType === 'AURA') {
        // need to query contract for unlock time
        // }

        return null;
      })
    );

    // Separate results into respective arrays
    const poolLiquidities: PortfolioLiquidity[] = [];
    const gaugeLiquidities: PortfolioLiquidity[] = [];

    lpAndFarmingPositionResults.forEach((result) => {
      if (!result) return;
      if (result.type === 'pool') {
        poolLiquidities.push(result.liquidity);
      } else if (result.type === 'gauge') {
        gaugeLiquidities.push(result.liquidity);
      }
    });

    /* 
    NOTE:
    The balancer api gives us the price of the users positions, because of this I didn't save the prices for the pool tokens
    in the cache. This makes this fetcher incompatible with the element registry because it gets the price internally inside the 
    liquidity element cache

    TODO: we could change this in the future to save the prices in the cache, bit it might make them less accurate
    */
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
    id: `${platformId}-${networkId}`,
    networkId,
    executor,
  };
}

export default getPoolPositionsFetcher;
