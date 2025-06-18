import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { Pools } from './types';

export const getEarned = (
  userLpAmountBN: BigNumber,
  userRewardDebtBN: BigNumber,
  accRewardPerShareP: string,
  p: number
): BigNumber => {
  const accRewardPerShare = new BN(accRewardPerShareP);
  const lpAmount = new BN(userLpAmountBN.toString());
  const rewardDebt = new BN(userRewardDebtBN.toString());
  const rewards = lpAmount.mul(accRewardPerShare).shrn(p).sub(rewardDebt);
  return new BigNumber(rewards.toNumber());
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
