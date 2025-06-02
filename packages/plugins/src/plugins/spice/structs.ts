import {
  array,
  BeetStruct,
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { i64, u128 } from '../../utils/solana';

export type StakeAccount = {
  accountDiscriminator: number[];
  authority: PublicKey;
  depositAmount: BigNumber;
  reward: BigNumber;
  rewardDebt: BigNumber;
  bump: number;
  multiplierAmount: BigNumber;
};

export const stakeAccountStruct = new BeetStruct<StakeAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['authority', publicKey],
    ['depositAmount', u128],
    ['reward', u128],
    ['rewardDebt', u128],
    ['bump', u8],
    ['multiplierAmount', u128],
  ],
  (args) => args as StakeAccount
);

export type StakeLock = {
  depositAmount: BigNumber;
  servingPeriod: BigNumber;
  startTime: BigNumber;
};

export const stakeLockStruct = new BeetStruct<StakeLock>(
  [
    ['depositAmount', u128],
    ['servingPeriod', i64],
    ['startTime', i64],
  ],
  (args) => args as StakeLock
);

export type StakeLockedAccount = {
  accountDiscriminator: number[];
  authority: PublicKey;
  stakeLock: StakeLock[];
  bump: number;
};

export const stakeLockedAccountStruct =
  new FixableBeetStruct<StakeLockedAccount>(
    [
      ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
      ['authority', publicKey],
      ['stakeLock', array(stakeLockStruct)],
      ['bump', u8],
    ],
    (args) => args as StakeLockedAccount
  );
