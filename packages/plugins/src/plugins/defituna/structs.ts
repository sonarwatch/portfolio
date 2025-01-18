import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

export type Lending = {
  buffer: Buffer;
  version: number;
  bump: number[];
  authority: PublicKey;
  poolMint: PublicKey;
  depositedFunds: BigNumber;
  depositedShares: BigNumber;
};

export const lendingStruct = new BeetStruct<Lending>(
  [
    ['buffer', blob(8)],
    ['version', u8],
    ['bump', uniformFixedSizeArray(u16, 1)],
    ['authority', publicKey],
    ['poolMint', publicKey],
    ['depositedFunds', u64],
    ['depositedShares', u64],
  ],
  (args) => args as Lending
);

export type LendingPool = {
  buffer: Buffer;
  version: number;
  bump: number[];
  mint: PublicKey;
  depositedFunds: BigNumber;
  depositedShares: BigNumber;
  borrowedFunds: BigNumber;
  borrowedShares: BigNumber;
  unpaidDebtShares: BigNumber;
  interestRate: BigNumber;
  lastUpdateTimestamp: BigNumber;
  supplyLimit: BigNumber;
  supplyApy: BigNumber;
  borrowApy: BigNumber;
};

export const lendingPoolStruct = new BeetStruct<LendingPool>(
  [
    ['buffer', blob(8)],
    ['version', u8],
    ['bump', uniformFixedSizeArray(u16, 1)],
    ['mint', publicKey],
    ['depositedFunds', u64],
    ['depositedShares', u64],
    ['borrowedFunds', u64],
    ['borrowedShares', u64],
    ['unpaidDebtShares', u64],
    ['interestRate', u64],
    ['lastUpdateTimestamp', u64],
    ['supplyLimit', u64],
  ],
  (args) => args as LendingPool
);
