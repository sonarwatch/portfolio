import { PublicKey } from '@solana/web3.js';
import {
  array,
  BeetStruct,
  FixableBeetStruct,
  i32,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { i64, u64 } from '../../utils/solana';

export type StakePool = {
  accountDiscriminator: number[];
  stakeTokenMint: PublicKey;
  stakedTokens: BigNumber;
  stakedNotes: BigNumber;
  withdrawingTokens: BigNumber;
  increaseNoteRatePerSecond: BigNumber;
  maxMultipleOfNote: BigNumber;
};

export const stakePoolStruct = new BeetStruct<StakePool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['stakeTokenMint', publicKey],
    ['stakedTokens', u64],
    ['stakedNotes', u64],
    ['withdrawingTokens', u64],
    ['increaseNoteRatePerSecond', u64],
    ['maxMultipleOfNote', u64],
  ],
  (args) => args as StakePool
);

export type StakeAccount = {
  accountDiscriminator: number[];
  owner: PublicKey;
  notes: BigNumber;
  stakedTokens: BigNumber;
  stakedNotes: BigNumber;
  withdrawingTokens: BigNumber;
  timeOfWithdrawApply: BigNumber;
  claimableReward: BigNumber;
  lastUpdateNoteTime: BigNumber;
  lastDistributedAndNoteRate: BigNumber;
};

export const stakeAccountStruct = new BeetStruct<StakeAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['owner', publicKey],
    ['notes', u64],
    ['stakedTokens', u64],
    ['stakedNotes', u64],
    ['withdrawingTokens', u64],
    ['timeOfWithdrawApply', i64],
    ['claimableReward', u64],
    ['lastUpdateNoteTime', i64],
    ['lastDistributedAndNoteRate', u64],
  ],
  (args) => args as StakeAccount
);

export type InterestRateData = {
  utilizationRate: number;
  kValue: number;
  bValue: number;
};

export const interestRateDataStruct = new BeetStruct<InterestRateData>(
  [
    ['utilizationRate', i32],
    ['kValue', i32],
    ['bValue', i32],
  ],
  (args) => args as InterestRateData
);
export type LendingPool = {
  accountDiscriminator: number[];
  nxMarket: PublicKey;
  tokenMint: PublicKey;
  borrowTokens: BigNumber;
  borrowNotes: BigNumber;
  depositTokens: BigNumber;
  depositNotes: BigNumber;
  depositInterest: BigNumber;
  borrowInterest: BigNumber;
  protocolFee: BigNumber;
  accruedUntil: BigNumber;
  utilizationFlag: number;
  interestRateConfigs: InterestRateData[];
};

export const lendingPoolStruct = new BeetStruct<LendingPool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['nxMarket', publicKey],
    ['tokenMint', publicKey],
    ['borrowTokens', u64],
    ['borrowNotes', u64],
    ['depositTokens', u64],
    ['depositNotes', u64],
    ['depositInterest', u64],
    ['borrowInterest', u64],
    ['protocolFee', u64],
    ['accruedUntil', i64],
    ['utilizationFlag', u16],
    ['interestRateConfigs', uniformFixedSizeArray(interestRateDataStruct, 0)],
  ],
  (args) => args as LendingPool
);

export type SolayerPool = {
  accountDiscriminator: number[];
  nxMarket: PublicKey;
  lrtMint: PublicKey;
  amount: BigNumber;
  totalNxSolayerPoints: BigNumber;
  lastUpdateTime: BigNumber;
};

export const solayerPoolStruct = new BeetStruct<SolayerPool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['nxMarket', publicKey],
    ['lrtMint', publicKey],
    ['amount', u64],
    ['totalNxSolayerPoints', u64],
    ['lastUpdateTime', i64],
  ],
  (args) => args as SolayerPool
);

export type LendingAccount = {
  accountDiscriminator: number[];
  nxMarket: PublicKey;
  owner: PublicKey;
  depositNotes: BigNumber;
  depositTokens: BigNumber;
  lastNoteRate: BigNumber;
  totalReward: BigNumber;
};

export const lendingAccountStruct = new BeetStruct<LendingAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['nxMarket', publicKey],
    ['owner', publicKey],
    ['depositNotes', u64],
    ['depositTokens', u64],
    ['lastNoteRate', u64],
    ['totalReward', u64],
  ],
  (args) => args as LendingAccount
);

export type VSolPositionDetail = {
  collateralMint: PublicKey;
  borrowMint: PublicKey;
  leverageMint: PublicKey;
  collateralNote: BigNumber;
  collateralTokens: BigNumber;
  borrowNote: BigNumber;
  borrowTokens: BigNumber;
  leverageNote: BigNumber;
  leverageTokens: BigNumber;
  leverageMultiples: BigNumber;
  lastPointsAndLeverageNotesRate: BigNumber;
  pointReward: BigNumber;
};

export const vSolPositionDetailStruct = new BeetStruct<VSolPositionDetail>(
  [
    ['collateralMint', publicKey],
    ['borrowMint', publicKey],
    ['leverageMint', publicKey],
    ['collateralNote', u64],
    ['collateralTokens', u64],
    ['borrowNote', u64],
    ['borrowTokens', u64],
    ['leverageNote', u64],
    ['leverageTokens', u64],
    ['leverageMultiples', u64],
    ['lastPointsAndLeverageNotesRate', u64],
    ['pointReward', u64],
  ],
  (args) => args as VSolPositionDetail
);

export type SwapTemp = {
  beforeAmount: BigNumber;
  expected: BigNumber;
};

export const swapTempStruct = new BeetStruct<SwapTemp>(
  [
    ['beforeAmount', u64],
    ['expected', u64],
  ],
  (args) => args as SwapTemp
);

export type VSolPosition = {
  accountDiscriminator: number[];
  nxMarket: PublicKey;
  owner: PublicKey;
  positions: VSolPositionDetail[];
  swapTemp: SwapTemp;
};

export const vSolPositionStruct = new FixableBeetStruct<VSolPosition>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['nxMarket', publicKey],
    ['owner', publicKey],
    ['positions', array(vSolPositionDetailStruct)],
    ['swapTemp', swapTempStruct],
  ],
  (args) => args as VSolPosition
);

export type PositionDetail = {
  collateralMint: PublicKey;
  borrowMint: PublicKey;
  leverageMint: PublicKey;
  collateralNote: BigNumber;
  collateralTokens: BigNumber;
  borrowNote: BigNumber;
  borrowTokens: BigNumber;
  leverageNote: BigNumber;
  leverageTokens: BigNumber;
  liquidationFlag: BigNumber;
  leverageMultiples: BigNumber;
  positionType: PositionType;
};

export enum PositionType {
  Normal,
  Solayer,
  Fragmetric,
}

export const positionDetailStruct = new BeetStruct<PositionDetail>(
  [
    ['collateralMint', publicKey],
    ['borrowMint', publicKey],
    ['leverageMint', publicKey],
    ['collateralNote', u64],
    ['collateralTokens', u64],
    ['borrowNote', u64],
    ['borrowTokens', u64],
    ['leverageNote', u64],
    ['leverageTokens', u64],
    ['liquidationFlag', u64],
    ['leverageMultiples', u64],
    ['positionType', u8],
  ],
  (args) => args as PositionDetail
);

export type FragmetricPosition = {
  accountDiscriminator: number[];
  nxMarket: PublicKey;
  owner: PublicKey;
  positions: PositionDetail[];
};

export const fragmetricPositionStruct =
  new FixableBeetStruct<FragmetricPosition>(
    [
      ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
      ['nxMarket', publicKey],
      ['owner', publicKey],
      ['positions', array(positionDetailStruct)],
    ],
    (args) => args as FragmetricPosition
  );

export type FragmetricUser = {
  accountDiscriminator: number[];
  nxMarket: PublicKey;
  owner: PublicKey;
  receiptToken: PublicKey;
  amount: BigNumber;
  nxFragmetricPoints: BigNumber;
  lastUpdateTime: BigNumber;
};

export const fragmetricUserStruct = new FixableBeetStruct<FragmetricUser>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['nxMarket', publicKey],
    ['owner', publicKey],
    ['receiptToken', publicKey],
    ['amount', u64],
    ['nxFragmetricPoints', u64],
    ['lastUpdateTime', i64],
  ],
  (args) => args as FragmetricUser
);

export type FragmetricPool = {
  accountDiscriminator: number[];
  nxMarket: PublicKey;
  receiptToken: PublicKey;
  amount: BigNumber;
  totalNxFragmetricPoints: BigNumber;
  lastUpdateTime: BigNumber;
  padding: BigNumber[];
};

export const fragmetricPoolStruct = new FixableBeetStruct<FragmetricPool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['nxMarket', publicKey],
    ['receiptToken', publicKey],
    ['amount', u64],
    ['totalNxFragmetricPoints', u64],
    ['lastUpdateTime', i64],
    ['padding', uniformFixedSizeArray(u64, 10)],
  ],
  (args) => args as FragmetricPool
);

export type StakePoolWithdrawal = {
  stakeAccount: PublicKey;
  solAmount: BigNumber;
};

export const stakePoolWithdrawalStruct = new BeetStruct<StakePoolWithdrawal>(
  [
    ['stakeAccount', publicKey],
    ['solAmount', u64],
  ],
  (args) => args as StakePoolWithdrawal
);

export type SolayerUser = {
  accountDiscriminator: number[];
  nxMarket: PublicKey;
  lrtMint: PublicKey;
  amount: BigNumber;
  nxSolayerPoints: BigNumber;
  lastUpdateTime: BigNumber;
  withdrawals: StakePoolWithdrawal[][]; // Nested vec
};

export const solayerUserStruct = new FixableBeetStruct<SolayerUser>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['nxMarket', publicKey],
    ['lrtMint', publicKey],
    ['amount', u64],
    ['nxSolayerPoints', u64],
    ['lastUpdateTime', i64],
    ['withdrawals', array(array(stakePoolWithdrawalStruct))],
  ],
  (args) => args as SolayerUser
);

export type CollateralDetail = {
  tokenMint: PublicKey;
  depositNote: BigNumber;
  depositToken: BigNumber;
  marketValue: BigNumber;
};

export const collateralDetailStruct = new BeetStruct<CollateralDetail>(
  [
    ['tokenMint', publicKey],
    ['depositNote', u64],
    ['depositToken', u64],
    ['marketValue', u64],
  ],
  (args) => args as CollateralDetail
);

export type LoanDetail = {
  tokenMint: PublicKey;
  loanNote: BigNumber;
  loanToken: BigNumber;
  loanValue: BigNumber;
};

export const loanDetailStruct = new BeetStruct<LoanDetail>(
  [
    ['tokenMint', publicKey],
    ['loanNote', u64],
    ['loanToken', u64],
    ['loanValue', u64],
  ],
  (args) => args as LoanDetail
);

export type MarginAccount = {
  accountDiscriminator: number[];
  leveragefi: PublicKey;
  owner: PublicKey;
  deposits: CollateralDetail[];
  loans: LoanDetail[];
  leverage: BigNumber;
  jlpNotes: BigNumber;
  activeLoan: PublicKey;
};

export const marginAccountStruct = new FixableBeetStruct<MarginAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['leveragefi', publicKey],
    ['owner', publicKey],
    ['deposits', array(collateralDetailStruct)],
    ['loans', array(loanDetailStruct)],
    ['leverage', u64],
    ['jlpNotes', u64],
    ['activeLoan', publicKey],
  ],
  (args) => args as MarginAccount
);

export type MarginPool = {
  accountDiscriminator: number[];
  leveragefi: PublicKey;
  vault: PublicKey;
  feeDestination: PublicKey;
  poolAuthority: PublicKey;
  tokenMint: PublicKey;
  tokenPriceOracle: PublicKey;
  borrowedTokens: BigNumber;
  depositTokens: BigNumber;
  depositNotes: BigNumber;
  loanNotes: BigNumber;
  depositInterest: BigNumber;
  loanInterest: BigNumber;
  protocolFee: BigNumber;
  accruedUntil: BigNumber;
  utilizationFlag: number;
};

export const marginPoolStruct = new BeetStruct<MarginPool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['leveragefi', publicKey],
    ['vault', publicKey],
    ['feeDestination', publicKey],
    ['poolAuthority', publicKey],
    ['tokenMint', publicKey],
    ['tokenPriceOracle', publicKey],
    ['borrowedTokens', u64],
    ['depositTokens', u64],
    ['depositNotes', u64],
    ['loanNotes', u64],
    ['depositInterest', u64],
    ['loanInterest', u64],
    ['protocolFee', u64],
    ['accruedUntil', i64],
    ['utilizationFlag', u16],
  ],
  (args) => args as MarginPool
);
