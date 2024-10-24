import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { lockProgramId, platformId } from './constants';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { vestingEscrowStruct } from './structs';
import { lockFilters } from './filters';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const vestingEscrowAccounts = await getParsedProgramAccounts(
    client,
    vestingEscrowStruct,
    lockProgramId,
    lockFilters(owner)
  );
  if (vestingEscrowAccounts.length === 0) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Vesting',
    name: 'lock',
  });

  for (const lock of vestingEscrowAccounts) {
    const endTime = lock.vestingStartTime.plus(
      lock.numberOfPeriod.times(lock.frequency)
    );

    element.addAsset({
      address: lock.tokenMint,
      amount: lock.amountPerPeriod
        .times(lock.numberOfPeriod)
        .minus(lock.totalClaimedAmount),
      attributes: { lockedUntil: endTime.toNumber() },
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-lock`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
