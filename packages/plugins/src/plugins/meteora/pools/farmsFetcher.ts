import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { farmsKey, platformId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { getParsedMultipleAccountsInfo } from '../../../utils/solana';
import { farmAccountStruct } from '../struct';
import { FormattedFarm } from '../types';
import { getStakingAccounts } from '../helpers';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const farms = await cache.getItem<FormattedFarm[]>(farmsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!farms) throw new Error('Farms not cached.');

  const farmsById: Map<string, FormattedFarm> = new Map();
  const farmsMint: string[] = [];
  farms.forEach((farm) => {
    farmsById.set(farm.pubkey, farm);
    farmsMint.push(farm.pubkey);
  });

  const farmingAccountsAddresses = getStakingAccounts(owner, farmsMint);
  const farmingAccounts = await getParsedMultipleAccountsInfo(
    client,
    farmAccountStruct,
    farmingAccountsAddresses
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  for (const farmingAccount of farmingAccounts) {
    if (!farmingAccount) continue;

    const { balanceStaked, rewardAPerTokenPending, rewardBPerTokenPending } =
      farmingAccount;
    const farmInfo = farmsById.get(farmingAccount.pool.toString());
    if (!farmInfo) continue;

    const { stakingMint, rewardAMint, rewardBMint } = farmInfo;

    const element = elementRegistry.addElementLiquidity({
      label: 'Farming',
      link: 'https://app.meteora.ag/farms',
    });

    const liquidity = element.addLiquidity({
      ref: farmingAccount.pubkey,
      sourceRefs: [{ name: 'Farm', address: farmInfo.pubkey.toString() }],
    });

    liquidity.addAsset({
      address: stakingMint,
      amount: balanceStaked,
    });

    liquidity.addRewardAsset({
      address: rewardAMint,
      amount: rewardAPerTokenPending,
    });

    liquidity.addRewardAsset({
      address: rewardBMint,
      amount: rewardBPerTokenPending,
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
