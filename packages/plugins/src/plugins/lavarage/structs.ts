import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { i64, u64 } from '../../utils/solana';

// Type for Pool
export type Pool = {
  discriminator: number[];
  interestRate: number;
  collateralType: PublicKey;
  maxBorrow: BigNumber;
  nodeWallet: PublicKey;
  maxExposure: BigNumber;
  currentExposure: BigNumber;
};

// Struct for Pool
export const poolStruct = new BeetStruct<Pool>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['interestRate', u8],
    ['collateralType', publicKey],
    ['maxBorrow', u64],
    ['nodeWallet', publicKey],
    ['maxExposure', u64],
    ['currentExposure', u64],
  ],
  (args) => args as Pool
);

// Type for Position
export type Position = {
  discriminator: number[];
  pool: PublicKey;
  closeStatusRecallTimestamp: BigNumber;
  amount: BigNumber;
  userPaid: BigNumber;
  collateralAmount: BigNumber;
  timestamp: BigNumber;
  trader: PublicKey;
  seed: PublicKey;
  closeTimestamp: BigNumber;
  closingPositionSize: BigNumber;
  interestRate: number;
  lastInterestCollect: BigNumber;
};

// Struct for Position
export const positionStruct = new BeetStruct<Position>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['pool', publicKey],
    ['closeStatusRecallTimestamp', u64],
    ['amount', u64],
    ['userPaid', u64],
    ['collateralAmount', u64],
    ['timestamp', i64],
    ['trader', publicKey],
    ['seed', publicKey],
    ['closeTimestamp', i64],
    ['closingPositionSize', u64],
    ['interestRate', u8],
    ['lastInterestCollect', i64],
  ],
  (args) => args as Position
);
