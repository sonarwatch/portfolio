import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { Miner, QuarryData } from './types';
import { Payroll } from './payroll';

export const getClaimableRewards = (
  quarryAccount: QuarryData,
  minerAccount: Miner
) => {
  const timeInSec = new BN(Math.floor(Date.now() / 1000));

  const payroll = new Payroll(
    new BN(quarryAccount.famineTs),
    new BN(quarryAccount.lastUpdateTs),
    new BN(quarryAccount.annualRewardsRate),
    new BN(quarryAccount.rewardsPerTokenStored),
    new BN(quarryAccount.totalTokensDeposited)
  );

  return new BigNumber(
    payroll
      .calculateRewardsEarned(
        timeInSec,
        new BN(minerAccount.balance),
        new BN(minerAccount.rewardsPerTokenPaid),
        new BN(minerAccount.rewardsEarned)
      )
      .toString()
  );
};
