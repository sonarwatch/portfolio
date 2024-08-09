import { PublicKey } from '@solana/web3.js';
import { MergeMiner, Miner, Position, Rewarder } from './types';
import { ParsedAccount } from '../../utils/solana';
import { getQuarryPDAs, isMinerAccount } from './helpers';

export const calculatePositions = (
  mergeMinerAccounts: ParsedAccount<MergeMiner>[],
  minerAccounts: ParsedAccount<Miner>[],
  replicaMinerAccounts: ParsedAccount<Miner>[][],
  allRewarders: Rewarder[],
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

    const rewardsToken = [
      quarryPDA.rewardsToken.toString(),
      ...quarryPDA.replicas.map((r) => r.rewardsMint.toString()),
    ];

    const rewardsBalance: string[] = isMinerAccount(account)
      ? [account.rewardsEarned]
      : replicaMinerAccounts[i].map((acc) => acc.rewardsEarned);

    positions.push({
      primaryRewarder: {
        slug: primaryRewarder.slug,
        name: primaryRewarder.info?.name,
      },
      stakedBalance: isMinerAccount(account)
        ? account.balance
        : account.primaryBalance,
      stakedTokenInfo: primaryQuarry.primaryTokenInfo,
      rewardsToken,
      rewardsBalance,
    });
  });

  return positions;
};
