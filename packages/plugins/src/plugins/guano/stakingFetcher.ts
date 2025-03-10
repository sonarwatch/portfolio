import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { guanoMint, platformId, stakingPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { stakeStruct, unstakeStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakeAccountFilters, unstakeAccountFilters } from './filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const [unstakeAccounts, stakeAccounts] = await Promise.all([
    getParsedProgramAccounts(
      client,
      unstakeStruct,
      stakingPid,
      unstakeAccountFilters(owner)
    ),
    getParsedProgramAccounts(
      client,
      stakeStruct,
      stakingPid,
      stakeAccountFilters(owner)
    ),
  ]);

  console.log(
    ' constexecutor:FetcherExecutor= ~ stakeStruct:',
    unstakeAccounts.map((acc) => acc.buffer)
  );
  console.log(
    ' constexecutor:FetcherExecutor= ~ stakeStruct:',
    stakeAccounts.map((acc) => acc.buffer)
  );

  // 85efvMdo92xCHzj5c19YBdtbmQRPV9pczvZisaNzRMc3 PENGU LOCK
  // 3yLmNQ2G8r6QhFHmqkjr1S7fxrYvJBiV7iHCghVgVvDC PENGU UNLOCK
  // AMvqAocs1QKe3mfFckwGbZFJ6MxgMhq8tEwuFWsmJvG6 BAT LOCK

  if (!unstakeAccounts && !stakeAccounts) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://cave.guanocoin.com/',
  });

  // TODO : need to figure out how to know which mint is locked/unlocked between BAT and PENGU
  unstakeAccounts.forEach((acc) => {
    const { tierType } = acc;
    const unlockAt = acc.createdAt
      .plus(tierType * 30 * 24 * 60 * 60)
      .times(1000);
    element.addAsset({
      address: guanoMint,
      amount: acc.amount,
      attributes: {
        lockedUntil: unlockAt.toNumber(),
      },
      ref: acc.pubkey,
    });
  });

  stakeAccounts.forEach((acc) => {
    element.addAsset({
      address: guanoMint,
      amount: acc.amount,
      attributes: {
        lockedUntil: undefined,
      },
      ref: acc.pubkey,
    });
  });
  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
