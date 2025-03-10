import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { spdrMint, pid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakeLockedStruct, stakeStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [stakeAccounts, stakeLockAccounts] = await Promise.all([
    getParsedProgramAccounts(connection, stakeStruct, pid, [
      {
        dataSize: 233,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 8,
        },
      },
    ]),
    getParsedProgramAccounts(connection, stakeLockedStruct, pid, [
      {
        dataSize: 429,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 8,
        },
      },
    ]),
  ]);
  if ([...stakeAccounts, ...stakeLockAccounts].length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
    link: 'https://www.spiderswap.io/staking',
  });

  stakeAccounts.forEach((acc) => {
    element.addAsset({
      address: spdrMint,
      amount: acc.depositAmount.minus(acc.multiplierAmount),
      ref: acc.pubkey.toString(),
    });
  });

  stakeLockAccounts.forEach((acc) => {
    acc.stakeLock.forEach((stakeLock) => {
      element.addAsset({
        address: spdrMint,
        amount: stakeLock.depositAmount,
        attributes: {
          lockedUntil: stakeLock.startTime
            .plus(stakeLock.servingPeriod)
            .times(1000)
            .toNumber(),
        },
        ref: acc.pubkey.toString(),
      });
    });
  });
  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
