import { StakingAccount, StakingConfig } from './types';

export const calcEarnings = (
  stakingAccount: StakingAccount,
  stakingConfig: StakingConfig
) => {
  const amount = Number(stakingConfig.amount);
  return Math.floor(
    ((Date.now() / 1e3 - Number(stakingAccount.lastClaim)) /
      Number(stakingConfig.interval)) *
      (stakingAccount.tff ? amount / 4 : amount)
  );
};
