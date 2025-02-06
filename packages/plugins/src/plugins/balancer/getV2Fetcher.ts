import BigNumber from 'bignumber.js';
import {
  PortfolioAssetToken,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';

import { BalancerSupportedEvmNetworkIdType, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getPoolPositionsForOwnerV2 } from './helpers/pools';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { getEvmClient } from '../../utils/clients';

import { liquidityGaugeAbi } from './abi';
import { Cache } from '../../Cache';

function getPoolsV2Fetcher(
  networkId: BalancerSupportedEvmNetworkIdType
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const ownerPoolPositions = await getPoolPositionsForOwnerV2(
      owner,
      networkId
    );
    const poolLiquidities: PortfolioLiquidity[] = [];
    const gaugeLiquidities: PortfolioLiquidity[] = [];

    for (const poolPosition of ownerPoolPositions) {
      const ownerShares = new BigNumber(poolPosition.userBalance.totalBalance);
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
        .filter((asset) => asset.data.address !== poolPosition.address);
      const summedValue = getUsdValueSum(assets.map((a) => a.value));

      const stackedBalance = poolPosition.userBalance.stakedBalances[0];

      // Liquidity Pool Position
      if (!stackedBalance) {
        const liquidity: PortfolioLiquidity = {
          assets,
          assetsValue: summedValue,
          value: summedValue,
          yields: [],
          rewardAssets: [],
          rewardAssetsValue: null,
        };
        poolLiquidities.push(liquidity);
        continue;
      }

      // Farming Position
      if (stackedBalance.stakingType === 'GAUGE') {
        const gaugeAddress = stackedBalance.stakingId;

        const client = getEvmClient(networkId);
        const numRewardsTokens = Number(
          await client.readContract({
            address: getAddress(gaugeAddress),
            abi: liquidityGaugeAbi,
            functionName: 'reward_count',
          })
        );

        const rewardTokenCalls = Array.from(
          { length: numRewardsTokens },
          (_, index) => ({
            address: getAddress(gaugeAddress),
            abi: liquidityGaugeAbi,
            functionName: 'reward_tokens',
            args: [index],
          })
        );

        const rewardTokenAddresses = (
          await client.multicall({
            contracts: rewardTokenCalls,
          })
        ).map((result) => result.result);

        const ownerRewardTokenBalanceCalls = rewardTokenAddresses.map(
          (rewardTokenAddress) => ({
            address: getAddress(gaugeAddress),
            abi: liquidityGaugeAbi,
            functionName: 'claimable_reward',
            args: [owner, rewardTokenAddress],
          })
        );

        const ownerRewardTokenBalances = (
          await client.multicall({
            contracts: ownerRewardTokenBalanceCalls,
          })
        )
          .map((result, index) => ({
            address: ownerRewardTokenBalanceCalls[index].args[1] as string,
            balance: new BigNumber((result.result as bigint).toString()),
          }))
          .filter((token) => token.balance.isGreaterThan(0));

        const ownerRewardTokenBalancesWithPrice = await Promise.all(
          ownerRewardTokenBalances.map(async (token) => {
            const tokenPrice = await cache.getTokenPrice(
              token.address,
              networkId
            );
            return {
              ...token,
              tokenPrice,
            };
          })
        );

        const rewardAssets: PortfolioAssetToken[] =
          ownerRewardTokenBalancesWithPrice.flatMap((rewardAsset) => {
            // maybe could add a safety check here so if the token price doesn't exist we fetch the decimal from the contract
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

        const liquidity: PortfolioLiquidity = {
          assets,
          assetsValue: summedValue,
          value: summedValue,
          yields: [],
          rewardAssets,
          rewardAssetsValue,
        };
        gaugeLiquidities.push(liquidity);
        continue;
      }

      // TODO suuport locked positions
      // if (stackedBalance.stakingType === 'VEBAL') {
      // need to query contract for unlock time
      // }

      // TODO aura staking - they appear under aura finance on debank?
      // if (stackedBalance.stakingType === 'AURA') {
      // need to query contract for unlock time
      // }
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
    id: `${platformId}-${networkId}-v2`,
    networkId,
    executor,
  };
}

// function getPoolsV2Fetcher(networkId: EvmNetworkIdType): Fetcher {
//   const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
//     const gaugesByPool = await cache.getItem<GaugesByPool>(
//       poolsAndGaugesV2CacheKey,
//       {
//         prefix: platformId,
//         networkId,
//       }
//     );
//     if (!gaugesByPool) return [];

//     const poolAddresses = Object.keys(gaugesByPool);
//     const gaugeAddresses = Object.values(gaugesByPool).flat();
//     const poolBalances = await getBalances(owner, poolAddresses, networkId);
//     const gaugeBalances = await getBalances(owner, gaugeAddresses, networkId);

//     const usefulPoolAddresses: string[] = [];
//     const userBalances: UserBalance[] = [];
//     let gaugeCount = 0;
//     for (let i = 0; i < poolAddresses.length; i++) {
//       console.log(poolAddresses[i]);
//       const poolAddress = poolAddresses[i];
//       const poolBalance = poolBalances[i];
//       const cGaugeAddresses = gaugesByPool[poolAddress];
//       const userBalance: UserBalance = {
//         poolAddress,
//         poolBalance,
//         gauges: [],
//       };
//       for (let j = 0; j < cGaugeAddresses.length; j++) {
//         const gaugeAddress = cGaugeAddresses[j];
//         const gaugeBalance = gaugeBalances[gaugeCount + j];
//         if (gaugeBalance) {
//           userBalance.gauges.push({
//             gaugeAddress,
//             gaugeBalance,
//           });
//         }
//       }
//       gaugeCount += cGaugeAddresses.length;

//       if (userBalance.poolBalance || userBalance.gauges.length !== 0) {
//         userBalances.push(userBalance);
//         usefulPoolAddresses.push(poolAddress);
//       }
//     }
//     if (usefulPoolAddresses.length === 0) return [];
//     const tokenPrices = await cache.getTokenPrices(
//       usefulPoolAddresses,
//       networkId
//     );

//     const poolLiquidities: PortfolioLiquidity[] = [];
//     const farmLiquidities: PortfolioLiquidity[] = [];
//     userBalances.forEach((userBalance, i) => {
//       const tokenPrice = tokenPrices[i];
//       if (!tokenPrice) return;
//       if (userBalance.poolBalance) {
//         const liquidity = getLiquidity(userBalance.poolBalance, tokenPrice);
//         poolLiquidities.push(liquidity);
//       }
//       userBalance.gauges.forEach((gauge) => {
//         const liquidity = getLiquidity(gauge.gaugeBalance, tokenPrice);
//         farmLiquidities.push(liquidity);
//       });
//     });

//     const elements: PortfolioElementLiquidity[] = [];
//     if (poolLiquidities.length !== 0) {
//       elements.push({
//         type: PortfolioElementType.liquidity,
//         label: 'LiquidityPool',
//         networkId,
//         platformId,
//         value: getUsdValueSum(poolLiquidities.map((a) => a.value)),
//         name: 'Balancer V2',
//         data: {
//           liquidities: poolLiquidities,
//         },
//       });
//     }
//     if (farmLiquidities.length !== 0) {
//       elements.push({
//         type: PortfolioElementType.liquidity,
//         label: 'Farming',
//         networkId,
//         platformId,
//         value: getUsdValueSum(farmLiquidities.map((a) => a.value)),
//         name: 'Balancer V2',
//         data: {
//           liquidities: farmLiquidities,
//         },
//       });
//     }
//     return elements;
//   };

//   return {
//     id: `${platformId}-${networkId}-v2`,
//     networkId,
//     executor,
//   };
// }
export default getPoolsV2Fetcher;
