import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getPendingAssetParams, getStakePubKey } from './helpers';
import { getParsedProgramAccounts, ParsedAccount } from '../../utils/solana';
import { userFarmConfigs } from './farmsJob';
import { FarmInfo } from './types';
import { UserFarmAccount } from './structs/farms';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

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
    .map((result) => (result.status === 'fulfilled' ? result.value : []))
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

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  const rayStakingPubkey = getStakePubKey(owner).toString();

  const uniqueElementForFarmsWithoutRewards =
    elementRegistry.addElementLiquidity({
      label: 'Farming',
    });
  const liquidityOfUniqueElement =
    uniqueElementForFarmsWithoutRewards.addLiquidity();

  for (let i = 0; i < userFarmAccounts.length; i += 1) {
    const userFarmAccount: ParsedAccount<UserFarmAccount> = userFarmAccounts[i];
    const farmInfo = farmsInfoMap.get(userFarmAccount.poolId.toString());
    if (!farmInfo) continue;

    const lpTokenPrice = farmInfo.lpToken;
    if (!lpTokenPrice) continue;

    const farmAccount = farmInfo.account;

    const element = elementRegistry.addElementLiquidity({
      label:
        userFarmAccount.pubkey.toString() === rayStakingPubkey
          ? 'Staked'
          : 'Farming',
    });

    const liquidity = element.addLiquidity();

    // Farm pending reward A
    if (farmInfo.rewardTokenA) {
      liquidity.addRewardAsset(
        getPendingAssetParams(
          userFarmAccount.depositBalance,
          userFarmAccount.rewardDebt,
          farmAccount.perShare,
          farmInfo.rewardTokenA,
          farmInfo.d
        )
      );
    }

    // Farm pending reward B
    if (
      farmInfo.rewardTokenB &&
      farmAccount.perShareB &&
      userFarmAccount.rewardDebtB
    ) {
      liquidity.addRewardAsset(
        getPendingAssetParams(
          userFarmAccount.depositBalance,
          userFarmAccount.rewardDebtB,
          farmAccount.perShareB,
          farmInfo.rewardTokenB,
          farmInfo.d
        )
      );
    }

    // LP staked on Farm
    const amount = userFarmAccount.depositBalance.div(
      10 ** farmInfo.lpToken.decimals
    );

    if (
      liquidity.rewardAssets.length > 0 ||
      userFarmAccount.pubkey.toString() === rayStakingPubkey
    ) {
      liquidity.addAsset({
        address: lpTokenPrice.address,
        amount,
        alreadyShifted: true,
      });
    } else {
      liquidityOfUniqueElement.addAsset({
        address: lpTokenPrice.address,
        amount,
        alreadyShifted: true,
      });
    }
  }

  return elementRegistry.dump(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
