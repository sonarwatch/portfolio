import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { i64, u128, u64 } from '../../utils/solana';

export type ParsedBoost = {
  pubkey: string;
  accountDiscriminator: number[];
  expiresAt: string;
  mint: string;
  weight: string;
  lastRewardsFactor: string;
  rewardsFactor: string;
  totalDeposits: string;
  totalStakers: string;
  withdrawFee: string;
};

// Type for Boost
export type Boost = {
  accountDiscriminator: number[];
  expiresAt: BigNumber;
  mint: PublicKey;
  weight: BigNumber;
  lastRewardsFactor: BigNumber;
  rewardsFactor: BigNumber;
  totalDeposits: BigNumber;
  totalStakers: BigNumber;
  withdrawFee: BigNumber;
};

// Struct for Boost
export const boostStruct = new BeetStruct<Boost>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['expiresAt', i64],
    ['lastRewardsFactor', u128],
    ['mint', publicKey],
    ['weight', u64],
    ['rewardsFactor', u128],
    ['totalDeposits', u64],
    ['totalStakers', u64],
    ['withdrawFee', u64],
  ],
  (args) => args as Boost
);

// Type for Config
export type Config = {
  accountDiscriminator: number[];
  admin: PublicKey;
  boosts: PublicKey[];
  len: number;
  rewardsFactor: BigNumber;
  takeRate: BigNumber;
  totalWeight: BigNumber;
};

// Struct for Config
export const configStruct = new BeetStruct<Config>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['admin', publicKey],
    ['boosts', uniformFixedSizeArray(publicKey, 256)], // Array of 256 PublicKeys
    ['len', u8],
    ['rewardsFactor', u128],
    ['takeRate', u64],
    ['totalWeight', u64],
  ],
  (args) => args as Config
);

// Type for Stake
export type Stake = {
  accountDiscriminator: number[];
  authority: PublicKey;
  balance: BigNumber;
  boost: PublicKey;
  lastClaimAt: BigNumber;
  lastDepositAt: BigNumber;
  lastWithdrawAt: BigNumber;
  lastRewardsFactor: BigNumber;
  rewards: BigNumber;
  buffer: number[];
};

// Struct for Stake
export const stakeStruct = new BeetStruct<Stake>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['authority', publicKey],
    ['balance', u64],
    ['boost', publicKey],
    ['lastClaimAt', i64],
    ['lastDepositAt', i64],
    ['lastWithdrawAt', i64],
    ['lastRewardsFactor', u128],
    ['rewards', u64],
    ['buffer', uniformFixedSizeArray(u8, 1024)], // Array of 1024 u8 values
  ],
  (args) => args as Stake
);
