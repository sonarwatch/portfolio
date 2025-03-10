import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programId, shadowMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { userStateStruct } from '../kamino/structs/vaults';
import { userStateFilter } from '../kamino/filters';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const userStateAccounts = await getParsedProgramAccounts(
    client,
    userStateStruct,
    programId,
    userStateFilter(owner)
  );
  if (userStateAccounts.length === 0) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://testnet.shdwdrive.com/',
  });

  for (const userState of userStateAccounts) {
    element.addAsset({
      address: shadowMint,
      amount: userState.activeStakeScaled.dividedBy(10 ** 18),
      ref: userState.pubkey,
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
