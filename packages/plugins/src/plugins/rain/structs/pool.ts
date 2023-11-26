import {
  BeetStruct,
  bool,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../../utils/solana';

export enum PoolStatus {
  Ready,
  Disabled,
}

export type Curve = {
  baseInterest: number;
  interestRate: number;
  curveRate: number;
  curveRateDay: number;
  maxDuration: BigNumber;
  maxAmount: BigNumber;
};

export const curveStruct = new BeetStruct<Curve>(
  [
    ['baseInterest', u16],
    ['interestRate', u16],
    ['curveRate', u16],
    ['curveRateDay', u16],
    ['maxDuration', u64],
    ['maxAmount', u64],
  ],
  (args) => args as Curve
);

export type PoolCondition = {
  isEnabled: boolean;
  minAge: BigNumber;
  minLoan: BigNumber;
  minVolume: number;
  liquidationThreshold: number;
  padding1: number;
  padding2: number;
  padding3: number;
};

export const poolConditionStruct = new BeetStruct<PoolCondition>(
  [
    ['isEnabled', bool],
    ['minAge', u64],
    ['minLoan', u64],
    ['minVolume', u64],
    ['liquidationThreshold', u16],
    ['padding1', u16],
    ['padding2', u16],
    ['padding3', u8],
  ],
  (args) => args as PoolCondition
);

export type PoolLiquidation = {
  loanLiquidation: number;
  mortgageLiquidation: number;
  isAutoSellEnabled: boolean;
  percentageMaxLoss: number;
};

export const poolLiquidationStruct = new BeetStruct<PoolLiquidation>(
  [
    ['loanLiquidation', u16],
    ['mortgageLiquidation', u16],
    ['isAutoSellEnabled', bool],
    ['percentageMaxLoss', u16],
  ],
  (args) => args as PoolLiquidation
);

export type PoolCollection = {
  collection: BigNumber;
  collectionLtv: number;
  exposure: number;
  amountUsed: BigNumber;
};

export const poolCollectionStruct = new BeetStruct<PoolCollection>(
  [
    ['collection', u32],
    ['collectionLtv', u16],
    ['exposure', u16],
    ['amountUsed', u64],
  ],
  (args) => args as PoolCollection
);

export type Pool = {
  buffer: Buffer;
  bump: number;
  owner: PublicKey;
  currency: PublicKey;
  oraclePoolUsd: PublicKey;
  oracleSolUsd: PublicKey;
  status: PoolStatus;
  isCompounded: boolean;
  isShared: boolean;
  totalAmount: BigNumber;
  borrowedAmount: BigNumber;
  availableAmount: BigNumber;
  usableAmount: BigNumber;
  loanCurve: Curve;
  mortgageCurve: Curve;
  isMortgageEnabled: boolean;
  nftLocked: BigNumber;
  totalLiquidations: BigNumber;
  totalLoans: BigNumber;
  totalMortgages: BigNumber;
  totalInterest: BigNumber;
  depositedAt: BigNumber;
  createdAt: BigNumber;
  updatedAt: BigNumber;
  collectionsUpdatedAt: BigNumber;
  lastLoanAt: BigNumber;
  lastMortgageAt: BigNumber;
  conditions: PoolCondition;
  liquidation: PoolLiquidation;
  whitelist: PublicKey;
  padding: BigNumber[];
  collections: PoolCollection[];
};

export const poolStruct = new BeetStruct<Pool>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['owner', publicKey],
    ['currency', publicKey],
    ['oraclePoolUsd', publicKey],
    ['oracleSolUsd', publicKey],
    ['status', u8],
    ['isCompounded', bool],
    ['isShared', bool],
    ['totalAmount', u64],
    ['borrowedAmount', u64],
    ['availableAmount', u64],
    ['usableAmount', u64],
    ['loanCurve', curveStruct],
    ['mortgageCurve', curveStruct],
    ['isMortgageEnabled', bool],
    ['nftLocked', u64],
    ['totalLiquidations', u64],
    ['totalLoans', u64],
    ['totalMortgages', u64],
    ['totalInterest', u64],
    ['depositedAt', u64],
    ['createdAt', u64],
    ['updatedAt', u64],
    ['collectionsUpdatedAt', u64],
    ['lastLoanAt', u64],
    ['lastMortgageAt', u64],
    ['conditions', poolConditionStruct],
    ['liquidation', poolLiquidationStruct],
    ['whitelist', publicKey],
    ['padding', uniformFixedSizeArray(u64, 16)],
    ['collections', uniformFixedSizeArray(poolCollectionStruct, 50)],
  ],
  (args) => args as Pool
);
