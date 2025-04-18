import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  u8,
  bool,
  u32,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { i64, u64 } from '../../utils/solana';

// Type for UserStats
export type UserStats = {
  accountDiscriminator: number[];
  isInitialized: boolean;
  userId: PublicKey;
  tokenId: number;
  tokensPurchased: BigNumber;
  isClaimed: boolean;
  bump: number;
};

// Struct for UserStats
export const userStatsStruct = new BeetStruct<UserStats>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['isInitialized', bool],
    ['userId', publicKey],
    ['tokenId', u32],
    ['tokensPurchased', u64],
    ['isClaimed', bool],
    ['bump', u8],
  ],
  (args) => args as UserStats
);

// Type for TokenStats
export type TokenStatsParsed = {
  pubkey: string;
  accountDiscriminator: number[];
  tokenId: number;
  decimals: number;
  paymentToken: string;
  startTime: string;
  endTime: string;
  cooldownDuration: string;
  tokenMint: string;
  saleSupply: string;
  claimedSupply: string;
  limitPerWallet: string;
  pricePerToken: string;
  revenue: string;
  minThreshold: string;
  maxThreshold: string;
  isLaunched: boolean;
  isClaimed: boolean;
  buyers: number;
  bump: number;
  sellEnabled: boolean;
};

// Type for TokenStats
export type TokenStats = {
  accountDiscriminator: number[];
  tokenId: number;
  decimals: number;
  paymentToken: PublicKey;
  startTime: BigNumber;
  endTime: BigNumber;
  cooldownDuration: BigNumber;
  tokenMint: PublicKey;
  saleSupply: BigNumber;
  claimedSupply: BigNumber;
  limitPerWallet: BigNumber;
  pricePerToken: BigNumber;
  revenue: BigNumber;
  minThreshold: BigNumber;
  maxThreshold: BigNumber;
  isLaunched: boolean;
  isClaimed: boolean;
  buyers: number;
  bump: number;
  sellEnabled: boolean;
};

// Struct for TokenStats
export const tokenStatsStruct = new BeetStruct<TokenStats>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['tokenId', u32],
    ['decimals', u8],
    ['paymentToken', publicKey],
    ['startTime', i64],
    ['endTime', i64],
    ['cooldownDuration', i64],
    ['tokenMint', publicKey],
    ['saleSupply', u64],
    ['claimedSupply', u64],
    ['limitPerWallet', u64],
    ['pricePerToken', u64],
    ['revenue', u64],
    ['minThreshold', u64],
    ['maxThreshold', u64], // Optional u64
    ['isLaunched', bool],
    ['isClaimed', bool],
    ['buyers', u32],
    ['bump', u8],
    ['sellEnabled', bool],
  ],
  (args) => args as TokenStats
);
