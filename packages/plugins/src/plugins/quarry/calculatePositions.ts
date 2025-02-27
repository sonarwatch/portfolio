import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  DetailedTokenInfo,
  MergeMiner,
  Miner,
  Position,
  QuarryData,
  Rewarder,
} from './types';
import { ParsedAccount } from '../../utils/solana';
import { getQuarryPDAs, isMinerAccount } from './helpers';
import { getClaimableRewards } from './getClaimableRewards';

export const calculatePositions = (
  mergeMinerAccounts: ParsedAccount<MergeMiner>[],
  minerAccounts: ParsedAccount<Miner>[],
  replicaMinerAccounts: ParsedAccount<Miner>[][],
  allRewarders: Rewarder[],
  quarryAccounts: ParsedAccount<QuarryData>[],
  owner: string
) => {
  const positions: Position[] = [];

  const quarryPDAS = getQuarryPDAs(allRewarders, new PublicKey(owner));

  [...mergeMinerAccounts, ...minerAccounts].forEach((account, i) => {
    if (!account) return;

    const quarryPDA = quarryPDAS.find((q) =>
      isMinerAccount(account)
        ? q.ownerMiner.toString() === account.pubkey.toString()
        : q.mm.toString() === account.pubkey.toString()
    );
    if (!quarryPDA) return;

    const primaryRewarder = allRewarders.find(
      (r) => r.rewarder === quarryPDA.rewarder.toString()
    );
    if (!primaryRewarder) return;

    const primaryQuarry = primaryRewarder.quarries.find(
      (q) => quarryPDA.primaryQuarry.toString() === q.quarry
    );
    if (!primaryQuarry) return;

    const rewardsBalance: BigNumber[] = [];
    const rewardsTokenInfo: DetailedTokenInfo[] = [];

    const primaryQuarryAccount = quarryAccounts.find(
      (q) => q.pubkey.toString() === primaryQuarry.quarry.toString()
    );
    if (!primaryQuarryAccount) return;

    let minerAccount;
    if (isMinerAccount(account)) {
      minerAccount = account;
      rewardsTokenInfo.push(primaryRewarder.rewardsTokenInfo);
      rewardsBalance.push(getClaimableRewards(primaryQuarryAccount, account));
    } else {
      minerAccount = replicaMinerAccounts[i].find(
        (a) => a.quarry === primaryQuarryAccount.pubkey.toString()
      );
      if (!minerAccount) return;

      rewardsTokenInfo.push(primaryRewarder.rewardsTokenInfo);
      rewardsBalance.push(
        getClaimableRewards(primaryQuarryAccount, minerAccount)
      );
      primaryQuarry.replicaQuarries.forEach((r) => {
        const quarryAccount = quarryAccounts.find(
          (q) => q.pubkey.toString() === r.quarry
        );
        if (!quarryAccount) return;
        const replicaMinerAccount = replicaMinerAccounts[i].find(
          (a) => a.quarry === quarryAccount.pubkey.toString()
        );
        if (!replicaMinerAccount) return;
        const replicaQuarryPDA = quarryPDA.replicas.find(
          (rq) => rq.replicaQuarry.toString() === r.quarry
        );
        if (!replicaQuarryPDA) return;
        const replicaRewarder = allRewarders.find(
          (rew) => rew.rewarder === replicaQuarryPDA.rewarder.toString()
        );
        if (!replicaRewarder) return;

        rewardsTokenInfo.push(replicaRewarder.rewardsTokenInfo);
        rewardsBalance.push(
          getClaimableRewards(quarryAccount, replicaMinerAccount)
        );
      });
    }

    positions.push({
      ref: minerAccount.pubkey.toString(),
      sourceRefs: [
        { name: 'Pool', address: primaryQuarryAccount.pubkey.toString() },
      ],
      primaryRewarder: {
        slug: primaryRewarder.slug,
        name: primaryRewarder.info?.name,
      },
      stakedBalance: isMinerAccount(account)
        ? account.balance
        : account.primaryBalance,
      stakedTokenInfo: primaryQuarry.primaryTokenInfo,
      rewardsTokenInfo,
      rewardsBalance,
    });
  });

  return positions;
};
