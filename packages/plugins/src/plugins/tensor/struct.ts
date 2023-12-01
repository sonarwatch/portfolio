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
import { blob, u64 } from '../../utils/solana';

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
