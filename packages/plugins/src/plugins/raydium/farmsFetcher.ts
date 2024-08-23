import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getPendingAssetToken } from './helpers';
import { getParsedProgramAccounts, ParsedAccount } from '../../utils/solana';
import { userFarmConfigs } from './farmsJob';
import { FarmInfo } from './types';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { UserFarmAccount } from './structs/farms';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const userFarmAccountsPromises = userFarmConfigs.map((userFarmConfig) =>
    getParsedProgramAccounts(
      client,
      userFarmConfig.struct,
      userFarmConfig.programId,
      userFarmConfig.filters(owner)
    )
  );
  const userFarmAccounts = (await Promise.allSettled(userFarmAccountsPromises))
    .flat(1)
    .map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return [];
    })
    .flat();

  if (userFarmAccounts.length === 0) return [];

  const farmsInfo = await cache.getItems<FarmInfo>(
    userFarmAccounts.map((acc) => acc.poolId.toString()),
    { prefix: `${platformId}/farm`, networkId: NetworkId.solana }
  );
  const farmsInfoMap: Map<string, FarmInfo> = new Map();
  farmsInfo.forEach((farmInfo) =>
    farmInfo
      ? farmsInfoMap.set(farmInfo.account.pubkey.toString(), farmInfo)
      : undefined
  );

  const liquiditiesWithoutRewards: PortfolioLiquidity[] = [];
  const elementsWithRewards: PortfolioElement[] = [];
  for (let i = 0; i < userFarmAccounts.length; i += 1) {
    const rewardAssets: PortfolioAsset[] = [];
    const assets: PortfolioAsset[] = [];
    const userFarmAccount: ParsedAccount<UserFarmAccount> = userFarmAccounts[i];
    const farmInfo = farmsInfoMap.get(userFarmAccount.poolId.toString());
    if (!farmInfo) continue;

    const lpTokenPrice = farmInfo.lpToken;
    if (!lpTokenPrice) continue;

    const farmAccount = farmInfo.account;

    // LP staked on Farm
    const amount = userFarmAccount.depositBalance
      .div(10 ** farmInfo.lpToken.decimals)
      .toNumber();
    if (amount > 0) {
      const underlyingAssets = tokenPriceToAssetTokens(
        lpTokenPrice.address,
        amount,
        NetworkId.solana,
        lpTokenPrice
      );
      assets.push(...underlyingAssets);
    }

    // Farm pending reward A
    if (farmInfo.rewardTokenA) {
      const assetTokenA = getPendingAssetToken(
        userFarmAccount.depositBalance,
        userFarmAccount.rewardDebt,
        farmAccount.perShare,
        farmInfo.rewardTokenA,
        farmInfo.d
      );
      if (assetTokenA.data.amount > 0) {
        rewardAssets.push(assetTokenA);
      }
    }

    // Farm pending reward B
    if (
      farmInfo.rewardTokenB &&
      farmAccount.perShareB &&
      userFarmAccount.rewardDebtB
    ) {
      const assetTokenB = getPendingAssetToken(
        userFarmAccount.depositBalance,
        userFarmAccount.rewardDebtB,
        farmAccount.perShareB,
        farmInfo.rewardTokenB,
        farmInfo.d
      );
      if (assetTokenB.data.amount > 0) {
        rewardAssets.push(assetTokenB);
      }
    }

    const assetsValue = getUsdValueSum(assets.map((a) => a.value));
    const rewardAssetsValue = getUsdValueSum(rewardAssets.map((r) => r.value));
    const value = getUsdValueSum([assetsValue, rewardAssetsValue]);
    if (value === 0) continue;

    if (rewardAssets.length === 0) {
      liquiditiesWithoutRewards.push({
        assets,
        assetsValue,
        rewardAssets: [],
        rewardAssetsValue: null,
        value: assetsValue,
        yields: [],
      });
      continue;
    }

    const liquidityWithRewards: PortfolioLiquidity = {
      value,
      assets,
      assetsValue,
      rewardAssets,
      rewardAssetsValue,
      yields: [],
    };
    elementsWithRewards.push({
      networkId: NetworkId.solana,
      platformId,
      type: PortfolioElementType.liquidity,
      label: 'Farming',
      value: liquidityWithRewards.value,
      data: {
        liquidities: [liquidityWithRewards],
      },
    });
  }

  if (
    liquiditiesWithoutRewards.length === 0 &&
    elementsWithRewards.length === 0
  )
    return [];

  return [
    ...elementsWithRewards,
    {
      networkId: NetworkId.solana,
      platformId,
      type: PortfolioElementType.liquidity,
      label: 'Farming',
      value: getUsdValueSum(liquiditiesWithoutRewards.map((l) => l.value)),
      data: {
        liquidities: liquiditiesWithoutRewards,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
