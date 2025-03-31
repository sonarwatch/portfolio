import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { Quarry, Miner } from './structs';
import { Payroll } from './payroll';
import { toBN } from '../../utils/misc/toBN';

export const getClaimableRewards = (
  quarryAccount: Quarry,
  minerAccount: Miner
) => {
  const timeInSec = new BN(Math.floor(Date.now() / 1000));

  const payroll = new Payroll(
    toBN(quarryAccount.famineTs),
    toBN(quarryAccount.lastUpdateTs),
    toBN(quarryAccount.annualRewardsRate),
    toBN(quarryAccount.rewardsPerTokenStored),
    toBN(quarryAccount.totalTokensDeposited)
  );

  return new BigNumber(
    payroll
      .calculateRewardsEarned(
        timeInSec,
        toBN(minerAccount.balance),
        toBN(minerAccount.rewardsPerTokenPaid),
        toBN(minerAccount.rewardsEarned)
      )
      .toString()
  );
};
