import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { address } from '@solana/kit';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programId, zeusMint } from './constants';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getProgramAccounts } from '../../utils/solana/accounts/getProgramAccounts';
import { delegationCodec } from './codecs';

const secondsInADay = 86400;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const accounts = await getProgramAccounts(programId, delegationCodec, [
    {
      key: 'delegator',
      val: address(owner),
    },
  ]);

  /* const account = accounts[0];
  if (account) {
    const acc = await getAccount(account.address, delegationCodec);
    const accs = await getMultipleAccounts([account.address], delegationCodec);
  } */

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementMultiple({
      label: 'Staked',
      ref: account.address,
      link: 'https://app.zeusguardian.io/delegations',
    });

    const startedRemovalAt = account.data.startedRemovalAt.isZero()
      ? new BigNumber(Date.now()).dividedBy(1000)
      : account.data.startedRemovalAt;

    let elpasedDays = startedRemovalAt
      .minus(account.data.createdAt)
      .dividedBy(secondsInADay)
      .toNumber();
    if (elpasedDays < 0) {
      elpasedDays = 0;
    } else if (elpasedDays > account.data.lockDays) {
      elpasedDays = account.data.lockDays;
    }

    const rewardAmount = account.data.amount
      .times(account.data.derivedRewardRate)
      .times(elpasedDays)
      .dividedBy(1000000);

    const claimableAmount = rewardAmount.isGreaterThan(
      account.data.claimedReward
    )
      ? rewardAmount.minus(account.data.claimedReward)
      : new BigNumber(0);

    const lockedUntil = account.data.createdAt
      .plus(account.data.lockDays * secondsInADay)
      .times(1000)
      .toNumber();

    element.addAsset({
      address: zeusMint,
      amount: claimableAmount,
    });

    if (Date.now() < lockedUntil) {
      element.addAsset({
        address: zeusMint,
        amount: account.data.claimableAmount,
        attributes: {
          lockedUntil,
        },
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-skit-delegations`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
