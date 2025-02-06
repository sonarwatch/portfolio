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

  for (const lock of vestingEscrowAccounts) {
    if (!lock.cancelledAt.isZero()) continue;

    const element = registry.addElementMultiple({
      label: 'Vesting',
      name: 'Lock',
      link: `https://lock.jup.ag/token/${lock.tokenMint}`,
      ref: lock.pubkey.toString(),
    });
    const endTime = lock.cliffTime
      .plus(lock.numberOfPeriod.times(lock.frequency))
      .times(1000);

    if (lock.totalClaimedAmount.isZero()) {
      // Unlock at cliff time
      element.addAsset({
        address: lock.tokenMint,
        amount: lock.cliffUnlockAmount,
        attributes: { lockedUntil: lock.cliffTime.times(1000).toNumber() },
      });

      // Remaining vesting with end date
      element.addAsset({
        address: lock.tokenMint,
        amount: lock.amountPerPeriod.times(lock.numberOfPeriod),
        attributes: { lockedUntil: endTime.toNumber() },
      });
    } else {
      // Remaining vesting with end date, minus already claimed
      element.addAsset({
        address: lock.tokenMint,
        amount: lock.amountPerPeriod
          .times(lock.numberOfPeriod)
          .plus(lock.cliffUnlockAmount)
          .minus(lock.totalClaimedAmount),
        attributes: { lockedUntil: endTime.toNumber() },
      });
    }
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-lock`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
