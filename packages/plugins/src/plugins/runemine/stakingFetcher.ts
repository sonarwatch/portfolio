import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { userStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getUserStakingPda } from './helper';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const stakingAccount = await getParsedAccountInfo(
    connection,
    userStruct,
    getUserStakingPda(owner)
  );
  if (!stakingAccount) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
    ref: stakingAccount.pubkey.toString(),
    link: 'https://app.runemine.com/staking',
  });

  element.addAsset({
    address: 'M1NEtUMtvTcZ5K8Ym6fY4DZLdKtBFeh8qWWpsPZiu5S',
    amount: stakingAccount.amount,
    attributes: {
      lockedUntil: stakingAccount.start
        .plus(stakingAccount.time)
        .times(1000)
        .toNumber(),
    },
  });
  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
