import {
  array,
  BeetStruct,
  FixableBeetStruct,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128 } from '../../utils/solana';

export type Stake = {
  buffer: Buffer;
  authority: PublicKey;
  depositAmount: BigNumber;
  reward: BigNumber;
  rewardDebt: BigNumber;
  bump: Buffer;
  multiplierAmount: BigNumber;
};

export const stakeStruct = new BeetStruct<Stake>(
  [
    ['buffer', blob(8)],
    ['authority', publicKey],
    ['depositAmount', u128],
    ['reward', u128],
    ['rewardDebt', u128],
    ['bump', blob(1)],
    ['multiplierAmount', u128],
  ],
  (args) => args as Stake
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

export type StakeLocked = {
  buffer: Buffer;
  authority: PublicKey;
  stakeLock: StakeLock[];
};

export const stakeLockedStruct = new FixableBeetStruct<StakeLocked>(
  [
    ['buffer', blob(8)],
    ['authority', publicKey],
    ['stakeLock', array(stakeLockStruct)],
  ],
  (args) => args as StakeLocked
);
