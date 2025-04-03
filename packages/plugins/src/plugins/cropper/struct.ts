import { FixableBeetStruct, u8 } from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { i64, u128, u64 } from '../../utils/solana';

export type UserStaking = {
  bump: number;
  reserved4: BigNumber;
  pool: PublicKey;
  authority: PublicKey;
  amount: BigNumber;
  rewardAmount: BigNumber;
  extraReward: BigNumber;
  rewardDebt: BigNumber;
  lastStakeTime: BigNumber;
  lockDuration: BigNumber;
  reserved1: BigNumber;
  reserved2: BigNumber;
  reserved3: BigNumber;
};

export const userStakingStruct = new FixableBeetStruct<UserStaking>(
  [
    ['bump', u8],
    ['reserved4', u64],
    ['pool', publicKey],
    ['authority', publicKey],
    ['amount', u64],
    ['rewardAmount', u128],
    ['extraReward', u128],
    ['rewardDebt', u128],
    ['lastStakeTime', i64],
    ['lockDuration', i64],
    ['reserved1', u128],
    ['reserved2', u128],
    ['reserved3', u128],
  ],
  (args) => args as UserStaking
);
