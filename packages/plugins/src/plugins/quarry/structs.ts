import { PublicKey } from '@solana/web3.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import {
  BeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { i64, u128, u64 } from '../../utils/solana';

export type Redeemer = {
  accountDiscriminator: number[];
  bump: number;
  iouMint: PublicKey;
  redemptionMint: PublicKey;
  redemptionVault: PublicKey;
};

export const redeemerStruct = new BeetStruct<Redeemer>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['iouMint', publicKey],
    ['redemptionMint', publicKey],
    ['redemptionVault', publicKey],
  ],
  (args) => args as Redeemer
);

export type QuarryRedeemer = {
  accountDiscriminator: number[];
  iouMint: PublicKey;
  redemptionMint: PublicKey;
  bump: number;
  totalTokensRedeemed: BigNumber;
};

export const quarryRedeemerStruct = new BeetStruct<QuarryRedeemer>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['iouMint', publicKey],
    ['redemptionMint', publicKey],
    ['bump', u8],
    ['totalTokensRedeemed', u64],
  ],
  (args) => args as QuarryRedeemer
);

export type MergeMiner = {
  accountDiscriminator: number[];
  pool: PublicKey;
  owner: PublicKey;
  bump: number;
  index: BigNumber;
  primaryBalance: BigNumber;
  replicaBalance: BigNumber;
};

export const mergeMinerStruct = new BeetStruct<MergeMiner>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['pool', publicKey],
    ['owner', publicKey],
    ['bump', u8],
    ['index', u64],
    ['primaryBalance', u64],
    ['replicaBalance', u64],
  ],
  (args) => args as MergeMiner
);

export type Miner = {
  accountDiscriminator: number[];
  quarry: PublicKey;
  authority: PublicKey;
  bump: number;
  tokenVaultKey: PublicKey;
  rewardsEarned: BigNumber;
  rewardsPerTokenPaid: BigNumber;
  balance: BigNumber;
  index: BigNumber;
};

export const minerStruct = new BeetStruct<Miner>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['quarry', publicKey],
    ['authority', publicKey],
    ['bump', u8],
    ['tokenVaultKey', publicKey],
    ['rewardsEarned', u64],
    ['rewardsPerTokenPaid', u128],
    ['balance', u64],
    ['index', u64],
  ],
  (args) => args as Miner
);

export type Quarry = {
  accountDiscriminator: number[];
  rewarder: PublicKey;
  tokenMintKey: PublicKey;
  bump: number;
  index: number;
  tokenMintDecimals: number;
  famineTs: BigNumber;
  lastUpdateTs: BigNumber;
  rewardsPerTokenStored: BigNumber;
  annualRewardsRate: BigNumber;
  rewardsShare: BigNumber;
  totalTokensDeposited: BigNumber;
  numMiners: BigNumber;
};

export const quarryStruct = new BeetStruct<Quarry>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['rewarder', publicKey],
    ['tokenMintKey', publicKey],
    ['bump', u8],
    ['index', u16],
    ['tokenMintDecimals', u8],
    ['famineTs', i64],
    ['lastUpdateTs', i64],
    ['rewardsPerTokenStored', u128],
    ['annualRewardsRate', u64],
    ['rewardsShare', u64],
    ['totalTokensDeposited', u64],
    ['numMiners', u64],
  ],
  (args) => args as Quarry
);
