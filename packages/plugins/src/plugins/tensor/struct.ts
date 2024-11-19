import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
  bool,
  u16,
  u32,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

// https://github.com/tensor-hq/tensorswap-sdk/tree/main/src/tensorswap/idl

export type SingleListing = {
  padding: Buffer;
  owner: PublicKey;
  nftMint: PublicKey;
  price: BigNumber;
  bump: number[];
  reserved: number[];
};

export const singleListingStruct = new BeetStruct<SingleListing>(
  [
    ['padding', blob(8)],
    ['owner', publicKey],
    ['nftMint', publicKey],
    ['price', u64],
    ['bump', uniformFixedSizeArray(u8, 1)],
    ['reserved', uniformFixedSizeArray(u8, 64)],
  ],
  (args) => args as SingleListing
);

export enum PoolType {
  Token,
  NFT,
  Trade,
}

export enum CurveType {
  Linear,
  Exponential,
}

export type PoolConfig = {
  poolType: PoolType;
  curveType: CurveType;
  startingPrice: BigNumber;
  delta: BigNumber;
  honorRoyalties: boolean;
  mmFeeBps: number;
};
export const poolConfigStruct = new BeetStruct<PoolConfig>(
  [
    ['poolType', u8],
    ['curveType', u8],
    ['startingPrice', u64],
    ['delta', u64],
    ['honorRoyalties', bool],
    ['mmFeeBps', u16],
  ],
  (args) => args as PoolConfig
);

export type TSwapConfig = {
  feeBps: number;
};
export const tSwapConfigStruct = new BeetStruct<TSwapConfig>(
  [['feeBps', u16]],
  (args) => args as TSwapConfig
);

export type TSwap = {
  version: number;
  bump: number[];
  config: TSwapConfig;
  owner: PublicKey;
  feeVault: PublicKey;
  cosigner: PublicKey;
};

export const tSwapStruct = new BeetStruct<TSwap>(
  [
    ['version', u8],
    ['bump', uniformFixedSizeArray(u8, 1)],
    ['config', tSwapConfigStruct],
    ['owner', publicKey],
    ['feeVault', publicKey],
    ['cosigner', publicKey],
  ],
  (args) => args as TSwap
);

export type Pool = {
  buffer: Buffer;
  owner: PublicKey;
  whitelist: PublicKey;
  solEscrow: PublicKey;
  takerSellCount: number;
  takerBuyCount: number;
  nftsHeld: number;
  padding: Buffer;
};

export const poolStruct = new BeetStruct<Pool>(
  [
    ['buffer', blob(71)],
    ['owner', publicKey],
    ['whitelist', publicKey],
    ['solEscrow', publicKey],
    ['takerSellCount', u32],
    ['takerBuyCount', u32],
    ['nftsHeld', u32],
    ['padding', blob(121)],
  ],
  (args) => args as Pool
);

export enum OrderType {
  Token,
  NFT,
}

export type OrderStateLock = {
  buffer: Buffer;
  version: number;
  bump: number[];
  orderId: number[];
  orderType: OrderType;
  nonce: number;
  maker: PublicKey;
  price: BigNumber;
  currency: PublicKey;
  aprBps: BigNumber;
  durationSec: BigNumber;
  whitelist: PublicKey;
  makerBroker: PublicKey;
  margin: PublicKey;
  expiry: BigNumber;
  createdAt: BigNumber;
  updatedAt: BigNumber;
  nftsHeld: BigNumber;
  vaultBalance: BigNumber;
  lockedAt: BigNumber;
  lockedUntil: BigNumber;
  taker: PublicKey;
  collateralReturned: boolean;
  lastExercisedAt: BigNumber;
  exerciseCount: BigNumber;
  accumulatedProfit: BigNumber;
  takerWithdrawnNfts: BigNumber;
  takerWithdrawnFunds: BigNumber;
  reserved: number[];
};
export const orderStateLockStruct = new BeetStruct<OrderStateLock>(
  [
    ['buffer', blob(8)],
    ['version', u8],
    ['bump', uniformFixedSizeArray(u8, 1)],
    ['orderId', uniformFixedSizeArray(u8, 32)],
    ['orderType', u8],
    ['nonce', u32],
    ['maker', publicKey],
    ['price', u64],
    ['currency', publicKey],
    ['aprBps', u32],
    ['durationSec', u32],
    ['whitelist', publicKey],
    ['makerBroker', publicKey],
    ['margin', publicKey],
    ['expiry', i64],
    ['createdAt', i64],
    ['updatedAt', i64],
    ['nftsHeld', u32],
    ['vaultBalance', u64],
    ['lockedAt', i64],
    ['lockedUntil', i64],
    ['taker', publicKey],
    ['collateralReturned', bool],
    ['lastExercisedAt', i64],
    ['exerciseCount', u32],
    ['accumulatedProfit', u64],
    ['takerWithdrawnNfts', u32],
    ['takerWithdrawnFunds', u64],
    ['reserved', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as OrderStateLock
);

export type VestingAccount = {
  padding: Buffer;
  owner: PublicKey;
};

export const vestingAccountStruct = new BeetStruct<VestingAccount>(
  [
    ['padding', blob(8)],
    ['owner', publicKey],
  ],
  (args) => args as VestingAccount
);
