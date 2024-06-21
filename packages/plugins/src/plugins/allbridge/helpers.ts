import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Pools } from './types';

export const getEarned = (
  userLpAmount: string,
  userRewardDebt: string,
  accRewardPerShareP: string,
  p: number
): BigNumber => {
  const userLpAmountBN = new BigNumber(userLpAmount);
  const accRewardPerSharePBN = new BigNumber(accRewardPerShareP);
  const userRewardDebtBN = new BigNumber(userRewardDebt);
  const rewards = userLpAmountBN
    .multipliedBy(accRewardPerSharePBN)
    .dividedBy(10 ** p);

  return rewards.minus(userRewardDebtBN);
};

export const getUserDepositPublicKeys = (poolInfo: Pools, owner: string) =>
  poolInfo.tokens.map(
    (pi) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('user_deposit', 'utf-8'),
          new PublicKey(pi.tokenAddress).toBuffer(),
          new PublicKey(owner).toBuffer(),
        ],
        new PublicKey(poolInfo.swapAddress)
      )[0]
  );
