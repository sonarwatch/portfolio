import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programId, zeusMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { delegationStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const secondsInADay = 86400;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(
    client,
    delegationStruct,
    new PublicKey(programId)
  )
    .addFilter('accountDiscriminator', [47, 21, 138, 89, 209, 154, 59, 130])
    .addFilter('delegator', new PublicKey(owner))
    .run();

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementMultiple({
      label: 'Staked',
      ref: account.pubkey.toString(),
      link: 'https://app.zeusguardian.io/delegations',
    });

    const startedRemovalAt = account.startedRemovalAt.isZero()
      ? new BigNumber(Date.now()).dividedBy(1000)
      : account.startedRemovalAt;

    let elpasedDays = startedRemovalAt
      .minus(account.createdAt)
      .dividedBy(secondsInADay)
      .toNumber();
    if (elpasedDays < 0) {
      elpasedDays = 0;
    } else if (elpasedDays > account.lockDays) {
      elpasedDays = account.lockDays;
    }

    const rewardAmount = account.amount
      .times(account.derivedRewardRate)
      .times(elpasedDays)
      .dividedBy(1000000);

    const claimableAmount = rewardAmount.isGreaterThan(account.claimedReward)
      ? rewardAmount.minus(account.claimedReward)
      : new BigNumber(0);

    const lockedUntil = account.createdAt
      .plus(account.lockDays * secondsInADay)
      .times(1000)
      .toNumber();

    element.addAsset({
      address: zeusMint,
      amount: claimableAmount,
    });

    if (Date.now() < lockedUntil) {
      element.addAsset({
        address: zeusMint,
        amount: account.claimableAmount,
        attributes: {
          lockedUntil,
        },
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-delegations`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
