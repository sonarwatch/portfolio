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
} from '@metaplex-foundation/beet';
import { i64, u64 } from '../../utils/solana';

export type PoolToken = {
  mint: PublicKey;
  decimals: number;
  scalingUp: boolean;
  scalingFactor: BigNumber;
  balance: BigNumber;
  weight: BigNumber;
};

export const poolTokenStruct = new BeetStruct<PoolToken>(
  [
    ['mint', publicKey],
    ['decimals', u8],
    ['scalingUp', bool],
    ['scalingFactor', u64],
    ['balance', u64],
    ['weight', u64],
  ],
  (args) => args as PoolToken
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
  tokens: PoolToken[];
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
    ['tokens', array(poolTokenStruct)],
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
  tokens: PoolToken[];
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
    ['tokens', array(poolTokenStruct)],
    ['pendingOwner', publicKey],
  ],
  (args) => args as StablePool
);
