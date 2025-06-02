import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { spiceMint, platformId, stakingProgramId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { stakeLockedAccountStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const accounts = await ParsedGpa.build(
    connection,
    stakeLockedAccountStruct,
    stakingProgramId
  )
    .addFilter('accountDiscriminator', [180, 153, 142, 118, 98, 6, 232, 34])
    .addFilter('authority', new PublicKey(owner))
    .run();
  if (!accounts) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementMultiple({
      label: 'Staked',
      link: 'https://staking.spicecoin.com/',
      ref: account.pubkey.toString(),
    });
    account.stakeLock.forEach((stakeLock) => {
      if (stakeLock.depositAmount.isZero()) return;

      const unlockAt = stakeLock.startTime
        .plus(stakeLock.servingPeriod)
        .times(1000);

      element.addAsset({
        address: spiceMint,
        amount: stakeLock.depositAmount,
        attributes: {
          lockedUntil: unlockAt.toNumber(),
        },
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
