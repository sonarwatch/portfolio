import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { farmsKey, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getPendingAssetParams, getStakePubKey } from './helpers';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  ParsedAccount,
} from '../../utils/solana';
import { userFarmConfigs } from './farmsJob';
import { FarmInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { LiquidityParams } from '../../utils/elementbuilder/Params';
import { UserFarmAccount } from './structs/farms';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const allFarms = await cache.getItem<Array<any>>(farmsKey, {
    prefix: `${platformId}`,
    networkId: NetworkId.solana,
  });

  let userFarmAccounts: ParsedAccount<UserFarmAccount>[];
  if (allFarms?.length) {
    const programToConfig = userFarmConfigs.reduce((acc: any, conf) => {
      acc[conf.programId.toString()] = conf;
      return acc;
    }, {});
    const programToPdas = allFarms?.reduce((acc: any, farm) => {
      if (!acc[farm.account.programId]) {
        acc[farm.account.programId] = {
          pdas: [],
          config: programToConfig[farm.account.programId],
        };
      }

      acc[farm.account.programId].pdas.push(
        PublicKey.findProgramAddressSync(
          [
            new PublicKey(farm.account.pubkey).toBuffer(),
            new PublicKey(owner).toBuffer(),
            Buffer.from('staker_info_v2_associated_seed', 'utf-8'),
          ],
          new PublicKey(farm.account.programId)
        )[0]
      );
      return acc;
    }, {});
    const promises = Object.values(programToPdas).map(async (program: any) => {
      return await getParsedMultipleAccountsInfo<UserFarmAccount[]>(
        client,
        program.config.struct,
        program.pdas
      );
    });
    const accounts = await Promise.all(promises);
    userFarmAccounts = accounts.flat().filter((acc) => acc !== null) as any;
  } else {
    const userFarmAccountsPromises = userFarmConfigs.map((userFarmConfig) =>
      getParsedProgramAccounts(
        client,
        userFarmConfig.struct,
        userFarmConfig.programId,
        userFarmConfig.filters(owner)
      )
    );
    userFarmAccounts = (await Promise.allSettled(userFarmAccountsPromises))
      .flat(1)
      .map((result) => (result.status === 'fulfilled' ? result.value : []))
      .flat();
  }

  if (userFarmAccounts.length === 0) return [];

  const farmsInfo = await cache.getItems<FarmInfo>(
    userFarmAccounts.map((acc) => acc.poolId.toString()),
    { prefix: `${platformId}/farm`, networkId: NetworkId.solana }
  );
  if (!farmsInfo) throw new Error('Farms info not cached');

  const farmsInfoMap: Map<string, FarmInfo> = new Map();
  farmsInfo.forEach((farmInfo) =>
    farmInfo
      ? farmsInfoMap.set(farmInfo.account.pubkey.toString(), farmInfo)
      : undefined
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  const rayStakingPubkey = getStakePubKey(owner).toString();

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

    const liquidityParams: LiquidityParams = {
      ref: userFarmAccount.pubkey,
      sourceRefs: [
        { name: 'Farm', address: userFarmAccount.poolId.toString() },
      ],
      link:
        userFarmAccount.pubkey.toString() === rayStakingPubkey
          ? 'https://raydium.io/staking/'
          : 'https://raydium.io/portfolio/?position_tab=standard',
    };

    const liquidity = element.addLiquidity(liquidityParams);

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

    liquidity.addAsset({
      address: lpTokenPrice.address,
      amount,
      alreadyShifted: true,
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
