import { BeetStruct, u8, array, bool, u32, uniformFixedSizeArray } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { GetProgramAccountsFilter, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u64, u128, i64 } from '../../utils/solana'; // Assuming custom utility for blob

// Define the VaultEarn struct using BeetStruct
export const vaultEarnBeet = new BeetStruct<VaultEarn>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['isInitialized', bool], // bool is 1 byte
    ['version', u8], // u8 is 1 byte
    ['bump', u8], // u8 is 1 byte
    ['align0', uniformFixedSizeArray(u8, 5)], // array of 5 u8, 5 bytes
    ['protocol', publicKey], // publicKey is 32 bytes
    ['earnStats', publicKey], // publicKey is 32 bytes
    ['creator', publicKey], // publicKey is 32 bytes
    ['authority', publicKey], // publicKey is 32 bytes
    ['earnConfig', publicKey], // publicKey is 32 bytes
    ['vaultLiquidity', publicKey], // publicKey is 32 bytes
    ['priceOracle', publicKey], // publicKey is 32 bytes
    ['priceFeed', uniformFixedSizeArray(u8, 64)], // array of 64 u8, 64 bytes
    ['tokenProgram', publicKey], // publicKey is 32 bytes
    ['tokenMint', publicKey], // publicKey is 32 bytes
    ['tokenDecimal', u8], // u8 is 1 byte
    ['align1', uniformFixedSizeArray(u8, 7)], // array of 7 u8, 7 bytes
    ['lastUpdated', u64], // i64 is 8 bytes
    ['unitSupply', u128], // u128 is 16 bytes
    ['unitBorrowed', u128], // u128 is 16 bytes
    ['unitLent', u128], // u128 is 16 bytes
    ['unitLeverage', u128], // u128 is 16 bytes
    ['index', u128], // u128 is 16 bytes
    ['lastIndexUpdated', i64], // i64 is 8 bytes
    ['apy', u128], // Assuming "rate" is represented as u128
    ['padding1', uniformFixedSizeArray(u8, 64)], // array of 64 u64, 64 * 8 = 512 bytes
  ],
  (args) => args as VaultEarn
);

// Define the VaultEarn interface to match the struct
export interface VaultEarn {
  discriminator: number[];
  isInitialized: boolean;
  version: number;
  bump: number;
  align0: number[];
  protocol: PublicKey;
  earnStats: PublicKey;
  creator: PublicKey;
  authority: PublicKey;
  earnConfig: PublicKey;
  vaultLiquidity: PublicKey;
  priceOracle: PublicKey;
  priceFeed: number[];
  tokenProgram: PublicKey;
  tokenMint: PublicKey;
  tokenDecimal: number;
  align1: number[];
  lastUpdated: BigNumber;
  unitSupply: string; // u128
  unitBorrowed: string; // u128
  unitLent: string; // u128
  unitLeverage: string; // u128
  index: BigNumber; // u128
  lastIndexUpdated: number;
  apy: BigNumber; // u128
  padding1: Buffer[];
}

export const earnLenderBeet = new BeetStruct<EarnLender>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['is_initialized', bool], // bool is 1 byte
    ['version', u8], // u8 is 1 byte
    ['bump', u8], // u8 is 1 byte
    ['align', uniformFixedSizeArray(u8, 5)], // array of 5 u8, 5 bytes
    ['owner', publicKey], // publicKey is 32 bytes
    ['protocol', publicKey], // publicKey is 32 bytes
    ['vault', publicKey], // publicKey is 32 bytes
    ['last_updated', i64], // i64 is 8 bytes
    ['pending_deposit_amount', u64], // i64 is 8 bytes
    ['pending_deposit_unit', u64], // i64 is 8 bytes
    ['pending_deposit_index', u128], // i64 is 8 bytes
    ['pending_withdraw_amount', u64], // i64 is 8 bytes
    ['pending_withdraw_unit', u64], // i64 is 8 bytes
    ['pending_withdraw_index', u128], // i64 is 8 bytes
    ['unit', u64], // i64 is 8 bytes
    ['index', u128], // i64 is 8 bytes
    ['padding1', uniformFixedSizeArray(u64, 10)], // array of 64 u64, 64 * 8 = 512 bytes
  ], 
  (args) => args as EarnLender
);

export interface EarnLender {
  discriminator: number[];
  is_initialized: boolean;
  version: number;
  bump: number;
  align: number[];
  owner: PublicKey;
  protocol: PublicKey;
  vault: PublicKey;
  last_updated: BigNumber;
  pending_deposit_amount: BigNumber;
  pending_deposit_unit: BigNumber;
  pending_deposit_index: BigNumber;
  pending_withdraw_amount: BigNumber;
  pending_withdraw_unit: BigNumber;
  pending_withdraw_index: BigNumber;
  unit: BigNumber;
  index: BigNumber;
  padding1: BigNumber[];
}
