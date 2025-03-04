import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { LifinityLockerProgramId, platformId, lfntyMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { escrowStruct } from './structs';
import { escrowFilter } from './filters';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    escrowStruct,
    LifinityLockerProgramId,
    escrowFilter(owner)
  );
  if (accounts.length !== 1) return [];

  const escrowAccount = accounts[0];

  const { amount, escrowEndsAt, duration } = escrowAccount;

  if (amount.isZero()) return [];

  const yearsLocked = duration.dividedBy(60 * 60 * 24 * 365).decimalPlaces(0);
  let name = 'Locked';
  if (escrowEndsAt.isZero()) {
    name += ` (${yearsLocked.toString()} year${
      yearsLocked.isGreaterThan(1) ? 's' : ''
    })`;
  }
  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Vesting',
    link: 'https://lifinity.io/reward',
    ref: escrowAccount.pubkey,
    name,
  });

  element.addAsset({
    address: lfntyMint,
    amount,
    attributes: {
      lockedUntil: escrowEndsAt.times(1000).toNumber() || undefined,
    },
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-locker`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
