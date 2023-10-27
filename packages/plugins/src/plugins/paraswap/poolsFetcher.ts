import {
  NetworkId,
  PortfolioAsset,
  PortfolioAssetToken,
  PortfolioElement,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  PSPToken,
  bptInfoKey,
  bptParaFarmer,
  bptParaStaker,
  platformId,
  poolAddresses,
} from './constants';
import { getEvmClient } from '../../utils/clients';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import {
  getTotalRewardsAbi,
  pendingWithdrawalsAbi,
  userVsNextIDAbi,
} from './abis';
import { PoolInfo, WithdrawStatus } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  // Farming
  const farmingBalanceContract = {
    address: bptParaFarmer.address,
    abi: balanceOfErc20ABI,
    functionName: balanceOfErc20ABI[0].name,
    args: [owner as `0x${string}`],
  } as const;

  const farmLpBalance = await client.readContract(farmingBalanceContract);

  const totalRewardsContract = {
    address: bptParaFarmer.address,
    abi: getTotalRewardsAbi,
    functionName: getTotalRewardsAbi[0].name,
    args: [owner as `0x${string}`],
  } as const;

  const farmRewardBalance = await client.readContract(totalRewardsContract);

  // Staking
  const nbrOfWithdrawContract = {
    address: bptParaStaker.address,
    abi: userVsNextIDAbi,
    functionName: userVsNextIDAbi[0].name,
    args: [owner as `0x${string}`],
  } as const;

  const baseUnlockingContract = {
    address: bptParaStaker.address,
    abi: pendingWithdrawalsAbi,
    functionName: 'userVsWithdrawals',
  } as const;
  const nbrOfWithdraws = await client.readContract(nbrOfWithdrawContract);

  const unlockingContracts = [];
  for (let i = BigInt(0); i < nbrOfWithdraws; i++) {
    unlockingContracts.push({
      ...baseUnlockingContract,
      args: [owner as `0x${string}`, i],
    } as const);
  }

  const withdrawals =
    unlockingContracts.length > 0
      ? await client.multicall({
          contracts: unlockingContracts,
        })
      : undefined;

  const stakingBalanceContract = {
    address: bptParaStaker.address,
    abi: balanceOfErc20ABI,
    functionName: balanceOfErc20ABI[0].name,
    args: [owner as `0x${string}`],
  } as const;

  const stakingLockedBalance = await client.readContract(
    stakingBalanceContract
  );

  if (
    stakingLockedBalance === BigInt(0) &&
    (!withdrawals || withdrawals.length === 0) &&
    farmLpBalance === BigInt(0)
  )
    return [];

  const { underlyings } = poolAddresses;

  const tokensPrices = await cache.getTokenPrices(
    underlyings,
    NetworkId.ethereum
  );

  const bptInfo = await cache.getItem<PoolInfo>(bptInfoKey, {
    prefix: platformId,
    networkId: NetworkId.ethereum,
  });
  if (!bptInfo) return [];

  const tokenPriceById: Map<string, TokenPrice> = new Map();
  for (const tokenPrice of tokensPrices) {
    if (!tokenPrice) continue;
    tokenPriceById.set(tokenPrice.address, tokenPrice);
  }

  const { balances } = bptInfo;
  const { totalSupply } = bptInfo;

  const farmAssets: PortfolioAssetToken[] = [];
  const stakeAssetsLocked: PortfolioAssetToken[] = [];
  const stakeAssetsUnlocking: PortfolioAssetToken[] = [];
  const rewardAssets: PortfolioAsset[] = [];

  for (let i = 0; i < underlyings.length; i++) {
    const underlying = underlyings[i];
    const tokenPrice = tokenPriceById.get(underlying);
    if (!tokenPrice) continue;

    const underlyingAmountRaw = new BigNumber(balances[i].toString()).dividedBy(
      totalSupply
    );

    if (farmLpBalance !== BigInt(0)) {
      const underlyingsAmountStaked = underlyingAmountRaw
        .multipliedBy(new BigNumber(stakingLockedBalance.toString()))
        .dividedBy(10 ** tokenPrice.decimals)
        .toNumber();
      farmAssets.push(
        tokenPriceToAssetToken(
          underlying,
          underlyingsAmountStaked,
          NetworkId.ethereum,
          tokenPrice
        )
      );
    }

    if (stakingLockedBalance !== BigInt(0)) {
      const underlyingsAmountLocked = underlyingAmountRaw
        .multipliedBy(new BigNumber(stakingLockedBalance.toString()))
        .dividedBy(10 ** tokenPrice.decimals)
        .toNumber();

      stakeAssetsLocked.push(
        tokenPriceToAssetToken(
          underlying,
          underlyingsAmountLocked,
          NetworkId.ethereum,
          tokenPrice
        )
      );
    }
  }

  const unlockingLiquidities: PortfolioLiquidity[] = [];
  if (withdrawals) {
    for (let n = 0; n < withdrawals.length; n++) {
      const withdrawal =
        withdrawals[n].status === 'success' ? withdrawals[n].result : undefined;
      if (!withdrawal) continue;
      const withdrawBalance = withdrawal[0];
      const withdrawStatus = withdrawal[2];
      // TODO : Unlocking date can be found here, not supported by our Data Structure for now.
      // const withdrawEpoch = Number(withdrawals[1]);
      // const dateToDisplay = new Date(withdrawEpoch * 1000).toLocaleDateString();
      if (
        withdrawBalance !== BigInt(0) &&
        withdrawStatus === WithdrawStatus.UNLOCKING
      ) {
        const unlockingAssets: PortfolioAsset[] = [];
        for (let t = 0; t < underlyings.length; t++) {
          const tokenPrice = tokenPriceById.get(underlyings[t]);
          if (!tokenPrice) continue;

          const underlyingsAmountUnlocking = new BigNumber(
            balances[t].toString()
          )
            .dividedBy(totalSupply)
            .multipliedBy(new BigNumber(withdrawBalance.toString()))
            .dividedBy(10 ** tokenPrice.decimals)
            .toNumber();

          unlockingAssets.push(
            tokenPriceToAssetToken(
              underlyings[t],
              underlyingsAmountUnlocking,
              NetworkId.ethereum,
              tokenPrice
            )
          );
        }

        unlockingLiquidities.push({
          assets: unlockingAssets,
          assetsValue: getUsdValueSum(unlockingAssets.map((a) => a.value)),
          rewardAssets: [],
          rewardAssetsValue: null,
          value: getUsdValueSum(unlockingAssets.map((a) => a.value)),
          yields: [],
        });
      }
    }
  }

  if (
    farmAssets.length === 0 &&
    stakeAssetsLocked.length === 0 &&
    stakeAssetsUnlocking.length === 0 &&
    unlockingLiquidities.length === 0
  )
    return [];

  const pspTokenPrice = tokenPriceById.get(PSPToken.address);
  if (pspTokenPrice && farmRewardBalance > BigInt(0)) {
    rewardAssets.push(
      tokenPriceToAssetToken(
        PSPToken.address,
        new BigNumber(farmRewardBalance.toString())
          .dividedBy(10 ** pspTokenPrice.decimals)
          .toNumber(),
        NetworkId.ethereum,
        pspTokenPrice
      )
    );
  }

  const elements: PortfolioElement[] = [];

  if (farmAssets.length !== 0) {
    const assetsValue = getUsdValueSum(farmAssets.map((a) => a.value));
    const rewardsValue = getUsdValueSum(rewardAssets.map((a) => a.value));
    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Staked',
      name: 'Boosted Pool',
      value: getUsdValueSum(farmAssets.map((a) => a.value)),
      data: {
        liquidities: [
          {
            assets: farmAssets,
            assetsValue: getUsdValueSum(farmAssets.map((a) => a.value)),
            rewardAssets,
            rewardAssetsValue: getUsdValueSum(rewardAssets.map((a) => a.value)),
            value: getUsdValueSum([assetsValue, rewardsValue]),
            yields: [],
          },
        ],
      },
    });
  }

  if (stakeAssetsLocked.length !== 0) {
    const assetsValue = getUsdValueSum(stakeAssetsLocked.map((a) => a.value));

    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Staked',
      name: 'Basic Pool',
      value: assetsValue,
      data: {
        liquidities: [
          {
            assets: stakeAssetsLocked,
            assetsValue,
            rewardAssets: [],
            rewardAssetsValue: null,
            value: assetsValue,
            yields: [],
          },
        ],
      },
    });
  }

  if (unlockingLiquidities.length !== 0) {
    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Farming',
      name: 'Unlocking',
      value: getUsdValueSum(unlockingLiquidities.map((a) => a.value)),
      data: {
        liquidities: unlockingLiquidities,
      },
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-pools-fetcher`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
