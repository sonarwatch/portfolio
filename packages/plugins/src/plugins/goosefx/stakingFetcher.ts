import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { gofxMint, platformId, stakerProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { userMetadataStruct } from './structs';
import { stakingAccountFilter } from './filters';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

export const sevenDays = 7 * 1000 * 60 * 60 * 24;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    userMetadataStruct,
    stakerProgramId,
    stakingAccountFilter(owner)
  );

  if (accounts.length === 0 || accounts.length > 1) return [];
  const stakingAccount = accounts[0];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://app.goosefx.io',
    ref: stakingAccount.pubkey.toString(),
  });

  for (const ticket of stakingAccount.unstakingTickets) {
    if (ticket.totalUnstaked.isZero()) continue;

    const unlockStartedAt = new Date(ticket.createdAt.times(1000).toNumber());
    const unlockingAt = new Date(unlockStartedAt.getTime() + sevenDays);
    element.addAsset({
      address: gofxMint,
      amount: ticket.totalUnstaked,
      attributes: {
        lockedUntil: unlockingAt.getTime(),
      },
    });
  }
  if (stakingAccount.totalStaked.isGreaterThan(0)) {
    element.addAsset({
      address: gofxMint,
      amount: stakingAccount.totalStaked,
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
