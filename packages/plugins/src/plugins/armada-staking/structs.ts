import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type StakeDepositReceipt = {
  buffer: Buffer;
  owner: PublicKey;
  payer: PublicKey;
  stakePool: PublicKey;
  lockupDuration: BigNumber;
  depositTimestamp: BigNumber;
  depositAmount: BigNumber;
  effectiveStake: BigNumber;
  claimedAmounts: BigNumber[];
};

export const StakeDepositReceiptStruct = new BeetStruct<StakeDepositReceipt>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['payer', publicKey],
    ['stakePool', publicKey],
    ['lockupDuration', u64],
    ['depositTimestamp', i64],
    ['depositAmount', u64],
    ['effectiveStake', u128],
    ['claimedAmounts', uniformFixedSizeArray(u128, 10)],
  ],
  (args) => args as StakeDepositReceipt
);

export type RewardPool = {
  rewardVault: PublicKey;
  rewardsPerEffectiveStake: BigNumber;
  lastAmount: BigNumber;
  padding0: number[];
};

export const rewardPoolStruct = new BeetStruct<RewardPool>(
  [
    ['rewardVault', publicKey],
    ['rewardsPerEffectiveStake', u128],
    ['lastAmount', u64],
    ['padding0', uniformFixedSizeArray(u8, 8)],
  ],
  (args) => args as RewardPool
);

export type StakePool = {
  buffer: Buffer;
  creator: PublicKey;
  authority: PublicKey;
  totalWeightedStake: BigNumber;
  vault: PublicKey;
  mint: PublicKey;
  stakeMint: PublicKey;
  rewardPools: RewardPool[];
  baseWeight: BigNumber;
  maxWeight: BigNumber;
  minDuration: BigNumber;
  maxDuration: BigNumber;
  nonce: number;
  bumpSeed: number;
  padding0: number[];
  reserved0: number[];
};

export const stakePoolStruct = new BeetStruct<StakePool>(
  [
    ['buffer', blob(8)],
    ['creator', publicKey],
    ['authority', publicKey],
    ['totalWeightedStake', u128],
    ['vault', publicKey],
    ['mint', publicKey],
    ['stakeMint', publicKey],
    ['rewardPools', uniformFixedSizeArray(rewardPoolStruct, 10)],
    ['baseWeight', u64],
    ['maxWeight', u64],
    ['minDuration', u64],
    ['maxDuration', u64],
    ['nonce', u8],
    ['bumpSeed', u8],
    ['padding0', uniformFixedSizeArray(u8, 6)],
    ['reserved0', uniformFixedSizeArray(u8, 256)],
  ],
  (args) => args as StakePool
);
