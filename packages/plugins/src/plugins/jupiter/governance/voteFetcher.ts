import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { getParsedAccountInfo } from '../../../utils/solana/getParsedAccountInfo';
import { getVotePda } from '../helpers';
import { escrowStruct, partialUnstakeStruct } from '../launchpad/structs';
import { jupMint, voteProgramId } from '../launchpad/constants';
import { platformId } from './constants';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { partialUnstakeFilter } from '../filters';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const escrowPubkey = getVotePda(owner);
  const escrowAccount = await getParsedAccountInfo(
    client,
    escrowStruct,
    escrowPubkey
  );
  if (!escrowAccount) return [];

  const partialUnstakingAccounts = await getParsedProgramAccounts(
    client,
    partialUnstakeStruct,
    voteProgramId,
    partialUnstakeFilter(escrowAccount.pubkey.toString())
  );

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  const element = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://vote.jup.ag',
  });

  element.addAsset({
    address: jupMint,
    amount: escrowAccount.amount,
    attributes: {
      lockedUntil: escrowAccount.escrowStartedAt.isZero()
        ? undefined
        : escrowAccount.escrowEndsAt.times(1000).toNumber(),
    },
    ref: escrowAccount.pubkey.toString(),
  });

  partialUnstakingAccounts.forEach((account) => {
    element.addAsset({
      address: jupMint,
      amount: account.amount,
      attributes: { lockedUntil: account.expiration.times(1000).toNumber() },
      ref: account.pubkey.toString(),
    });
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-vote`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
