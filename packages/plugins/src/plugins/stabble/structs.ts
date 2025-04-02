import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import {
  u8,
  bool,
  BeetStruct,
  FixableBeetStruct,
  array,
  uniformFixedSizeArray,
  u16,
  u32,
} from '@metaplex-foundation/beet';
import { i64, u128, u64 } from '../../utils/solana';

export type StablePoolToken = {
  mint: PublicKey;
  decimals: number;
  scalingUp: boolean;
  scalingFactor: BigNumber;
  balance: BigNumber;
};

export const stablePoolTokenStruct = new BeetStruct<StablePoolToken>(
  [
    ['mint', publicKey],
    ['decimals', u8],
    ['scalingUp', bool],
    ['scalingFactor', u64],
    ['balance', u64],
  ],
  (args) => args as StablePoolToken
);

export type WeightedPoolToken = {
  mint: PublicKey;
  decimals: number;
  scalingUp: boolean;
  scalingFactor: BigNumber;
  balance: BigNumber;
  weight: BigNumber;
};

export const weightedPoolTokenStruct = new BeetStruct<WeightedPoolToken>(
  [
    ['mint', publicKey],
    ['decimals', u8],
    ['scalingUp', bool],
    ['scalingFactor', u64],
    ['balance', u64],
    ['weight', u64],
  ],
  (args) => args as WeightedPoolToken
);

export type WeightedPool = {
  accountDiscriminator: number[];
  owner: PublicKey;
  vault: PublicKey;
  mint: PublicKey;
  authorityBump: number;
  isActive: boolean;
  invariant: BigNumber;
  swapFee: BigNumber;
  tokens: StablePoolToken[];
  pendingOwner?: PublicKey;
};

export const weightedPoolStruct = new FixableBeetStruct<WeightedPool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['owner', publicKey],
    ['vault', publicKey],
    ['mint', publicKey],
    ['authorityBump', u8],
    ['isActive', bool],
    ['invariant', u64],
    ['swapFee', u64],
    ['tokens', array(weightedPoolTokenStruct)],
    ['pendingOwner', publicKey],
  ],
  (args) => args as WeightedPool
);

export type StablePool = {
  accountDiscriminator: number[];
  owner: PublicKey;
  vault: PublicKey;
  mint: PublicKey;
  authorityBump: number;
  isActive: boolean;
  ampInitialFactor: number;
  ampTargetFactor: number;
  rampStartTs: BigNumber;
  rampStopTs: BigNumber;
  swapFee: BigNumber;
  tokens: StablePoolToken[];
  pendingOwner?: PublicKey;
};

export const stablePoolStruct = new FixableBeetStruct<StablePool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['owner', publicKey],
    ['vault', publicKey],
    ['mint', publicKey],
    ['authorityBump', u8],
    ['isActive', bool],
    ['ampInitialFactor', u16],
    ['ampTargetFactor', u16],
    ['rampStartTs', i64],
    ['rampStopTs', i64],
    ['swapFee', u64],
    ['tokens', array(stablePoolTokenStruct)],
    ['pendingOwner', publicKey],
  ],
  (args) => args as StablePool
);

export type Miner = {
  accountDiscriminator: number[];
  pool: PublicKey;
  authority: PublicKey;
  beneficiary: PublicKey;
  bump: number;
  amount: BigNumber;
  rewardsDebt: BigNumber;
  rewardsCredit: BigNumber;
  rewardsClaimed: BigNumber;
};

export const minerStruct = new BeetStruct<Miner>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['pool', publicKey],
    ['authority', publicKey],
    ['beneficiary', publicKey],
    ['bump', u8],
    ['amount', u64],
    ['rewardsDebt', u64],
    ['rewardsCredit', u64],
    ['rewardsClaimed', u64],
  ],
  (args) => args as Miner
);

// Type for Pool
export type StakedPool = {
  accountDiscriminator: number[];
  rewarder: PublicKey;
  mint: PublicKey;
  decimals: number;
  weight: number;
  totalAmount: BigNumber;
  totalRewardsDebt: BigNumber;
  totalRewardsCredit: BigNumber;
  totalRewardsDistributed: BigNumber;
  totalWeights: BigNumber;
  rewardsPerAmount: BigNumber;
  numMiners: number;
};

// Struct for Pool
export const stakedPoolStruct = new BeetStruct<StakedPool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['rewarder', publicKey],
    ['mint', publicKey],
    ['decimals', u8],
    ['weight', u32],
    ['totalAmount', u64],
    ['totalRewardsDebt', u64],
    ['totalRewardsCredit', u64],
    ['totalRewardsDistributed', u64],
    ['totalWeights', u128],
    ['rewardsPerAmount', u128],
    ['numMiners', u32],
  ],
  (args) => args as StakedPool
);
