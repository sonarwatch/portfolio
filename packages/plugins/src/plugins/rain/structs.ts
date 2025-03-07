import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import {
  uniformFixedSizeArray,
  FixableBeetStruct,
  u32,
  u8,
  u16,
  BeetStruct,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { u128, u64 } from '../../utils/solana';

export const poolLiquidationStruct = new BeetStruct<PoolLiquidation>(
  [
    ['loanLiquidation', u16],
    ['mortgageLiquidation', u16],
    ['isAutoSellEnabled', u8],
    ['padding1', u8],
    ['padding2', u16],
  ],
  (args) => args as PoolLiquidation
);
export const poolLimitStruct = new FixableBeetStruct<PoolLimit>(
  [
    ['minDuration', u32],
    ['maxDuration', u32],
    ['maxAmountUsd', u32],
    ['minAmountUsd', u32],
    ['reserved', uniformFixedSizeArray(u64, 10)],
  ],
  (args) => args as PoolLimit
);

export const poolCurrencyStruct = new BeetStruct<PoolCurrency>(
  [
    ['currency', u32],
    ['currencyLtv', u16],
    ['exposure', u16],
    ['borrowedAmount', u64],
  ],
  (args) => args as PoolCurrency
);

export const delegatorStruct = new BeetStruct<Delegator>(
  [
    ['delegatorType', u8],
    ['delegatedAmount', u64],
  ],
  (args) => args as Delegator
);

export const poolConditionStruct = new FixableBeetStruct<PoolCondition>(
  [
    ['minAge', u64],
    ['minLoan', u64],
    ['minVolume', u64],
    ['unused', u64],
    ['liquidationThreshold', u16],
    ['isEnabled', u8],
    ['padding1', uniformFixedSizeArray(u8, 5)],
    ['whitelist', publicKey],
    ['reserved', uniformFixedSizeArray(u64, 10)],
  ],
  (args) => args as PoolCondition
);

export const personalBankStruct = new FixableBeetStruct<PersonalBank>(
  [
    ['reserved', uniformFixedSizeArray(u8, 32)],
    ['reserved1', uniformFixedSizeArray(u8, 32)],
    ['reserved2', uniformFixedSizeArray(u8, 16)],
  ],
  (args) => args as PersonalBank
);

export enum BankType {
  Personal,
  Shared,
}

export enum CurveConfig {
  Apr,
}

export enum CurveType {
  Apr,
}

export enum DelegatorType {
  Empty,
  Marginfi,
}

export enum LoanKind {
  Classic,
  MarginSwap,
  Request,
}

export enum LoanKindConfig {
  Classic,
  MarginSwap,
}

export enum LoanStatus {
  Ongoing,
  Repaid,
  Liquidated,
  Sold,
}

export enum OracleConfig {
  None,
  Pyth,
  Switchboard,
  SwitchboardOnDemand,
}

export enum OracleType {
  Empty,
  Pyth,
  Switchboard,
  SwitchboardOnDemand,
}

export enum PoolStatus {
  Enabled,
  Disabled,
}

export enum QuoteStep {
  Open,
  Start,
  End,
  Close,
}

export enum QuoteType {
  None,
  MarginSwap,
  InstantSell,
  Liquidate,
}

export enum SetConfig {
  UpdateMinDuration,
  UpdateMaxDuration,
  UpdateMaxAmountUsd,
  UpdateMinAmountUsd,
}

export enum SetCurrencyConfig {
  UpdateIsLocked,
  UpdateOracle,
}

export enum SetPoolConfig {
  EnablePool,
  DisablePool,
  EnableAutoSell,
  DisableAutoSell,
  UpdateCurve,
  UpdateCurrencies,
  UpdateConditions,
  UpdateLimits,
}

export type Bank = {
  accountDiscriminator: number[];
  owner: PublicKey;
  mint: PublicKey;
  vault: PublicKey;
  authority: PublicKey;
  bankType: BankType;
  bankTypeDetail: PersonalBank;
  totalLiquidity: BigNumber;
  availableLiquidity: BigNumber;
  delegatedLiquidity: BigNumber;
  cooldownLiquidity: BigNumber;
  cooldownPeriod: BigNumber;
  delegators: Delegator[];
  createdAt: BigNumber;
  depositedAt: BigNumber;
  withdrawnAt: BigNumber;
  borrowedAt: BigNumber;
  repaidAt: BigNumber;
  frozenUntil: BigNumber;
  reserved: number[];
};

export const bankStruct = new FixableBeetStruct<Bank>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['owner', publicKey],
    ['mint', publicKey],
    ['vault', publicKey],
    ['authority', publicKey],
    ['bankType', u8],
    ['bankTypeDetail', personalBankStruct],
    ['totalLiquidity', u64],
    ['availableLiquidity', u64],
    ['delegatedLiquidity', u64],
    ['cooldownLiquidity', u64],
    ['cooldownPeriod', u64],
    ['delegators', uniformFixedSizeArray(delegatorStruct, 8)],
    ['createdAt', u64],
    ['depositedAt', u64],
    ['withdrawnAt', u64],
    ['borrowedAt', u64],
    ['repaidAt', u64],
    ['frozenUntil', u64],
    ['reserved', uniformFixedSizeArray(u8, 512)],
  ],
  (args) => args as Bank
);

export type Config = {
  accountDiscriminator: number[];
  minDuration: number;
  maxDuration: number;
  maxAmountUsd: number;
  minAmountUsd: number;
  admins: PublicKey[];
  managers: PublicKey[];
  reserved: number[];
};

export const configStruct = new FixableBeetStruct<Config>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['minDuration', u32],
    ['maxDuration', u32],
    ['maxAmountUsd', u32],
    ['minAmountUsd', u32],
    ['admins', uniformFixedSizeArray(publicKey, 10)],
    ['managers', uniformFixedSizeArray(publicKey, 10)],
    ['reserved', uniformFixedSizeArray(u8, 512)],
  ],
  (args) => args as Config
);

export type Currency = {
  accountDiscriminator: number[];
  currencyId: number;
  padding1: number[];
  mint: PublicKey;
  tokenProgram: PublicKey;
  isLocked: number;
  decimals: number;
  padding2: number[];
  oracles: OracleType[];
  padding3: number[];
  currentLoan: BigNumber;
  createdAt: BigNumber;
  updatedAt: BigNumber;
  reserved: number[];
};

export const currencyStruct = new FixableBeetStruct<Currency>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['currencyId', u32],
    ['padding1', uniformFixedSizeArray(u8, 4)],
    ['mint', publicKey],
    ['tokenProgram', publicKey],
    ['isLocked', u8],
    ['decimals', u8],
    ['padding2', uniformFixedSizeArray(u8, 6)],
    ['oracles', uniformFixedSizeArray(u8, 5)],
    ['padding3', uniformFixedSizeArray(u8, 3)],
    ['currentLoan', u64],
    ['createdAt', u64],
    ['updatedAt', u64],
    ['reserved', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as Currency
);

export type DefiLoan = {
  accountDiscriminator: number[];
  kind: LoanKind;
  kindDetail: number[];
  status: LoanStatus;
  isCustom: number;
  padding1: number[];
  borrower: PublicKey;
  bank: PublicKey;
  pool: PublicKey;
  collateral: PublicKey;
  principal: PublicKey;
  referrer: PublicKey;
  interest: BigNumber;
  borrowedAmount: BigNumber;
  collateralAmount: BigNumber;
  duration: number;
  currency: number;
  liquidation: number;
  padding2: number[];
  createdAt: BigNumber;
  expiredAt: BigNumber;
  repaidAt: BigNumber;
  liquidatedAt: BigNumber;
  soldAmount: BigNumber;
  reserved: BigNumber[];
};

export const defiLoanStruct = new FixableBeetStruct<DefiLoan>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['kind', u8],
    ['kind', uniformFixedSizeArray(u8, 64)],
    ['status', u8],
    ['isCustom', u8],
    ['padding1', uniformFixedSizeArray(u8, 6)],
    ['borrower', publicKey],
    ['bank', publicKey],
    ['pool', publicKey],
    ['collateral', publicKey],
    ['principal', publicKey],
    ['referrer', publicKey],
    ['interest', u64],
    ['borrowedAmount', u64],
    ['collateralAmount', u64],
    ['duration', u32],
    ['currency', u32],
    ['liquidation', u16],
    ['padding2', uniformFixedSizeArray(u8, 6)],
    ['createdAt', u64],
    ['expiredAt', u64],
    ['repaidAt', u64],
    ['liquidatedAt', u64],
    ['soldAmount', u64],
    ['reserved', uniformFixedSizeArray(u64, 9)],
  ],
  (args) => args as DefiLoan
);

export type Pool = {
  accountDiscriminator: number[];
  owner: PublicKey;
  seed: number[];
  status: PoolStatus;
  bump: number;
  padding1: number[];
  currentLoan: BigNumber;
  curve: CurveType;
  conditions: PoolCondition;
  liquidation: PoolLiquidation;
  limits: PoolLimit;
  totalLiquidations: BigNumber;
  totalLoans: BigNumber;
  totalInterest: BigNumber;
  createdAt: BigNumber;
  updatedAt: BigNumber;
  currenciesUpdatedAt: BigNumber;
  lastLoanAt: BigNumber;
  reserved: BigNumber[];
  currencies: PoolCurrency[];
};

export const poolStruct = new FixableBeetStruct<Pool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['owner', publicKey],
    ['seed', uniformFixedSizeArray(u8, 32)],
    ['status', u8],
    ['bump', u8],
    ['padding1', uniformFixedSizeArray(u8, 6)],
    ['currentLoan', u64],
    ['curve', u8],
    ['conditions', poolConditionStruct],
    ['liquidation', poolLiquidationStruct],
    ['limits', poolLimitStruct],
    ['totalLiquidations', u64],
    ['totalLoans', u64],
    ['totalInterest', u64],
    ['createdAt', u64],
    ['updatedAt', u64],
    ['currenciesUpdatedAt', u64],
    ['lastLoanAt', u64],
    ['reserved', uniformFixedSizeArray(u64, 14)],
    ['currencies', uniformFixedSizeArray(poolCurrencyStruct, 64)],
  ],
  (args) => args as Pool
);

export type Quote = {
  accountDiscriminator: number[];
  quoteType: QuoteType;
  quoteStep: QuoteStep;
  padding1: number[];
  quote: PublicKey;
  payer: PublicKey;
  borrower: PublicKey;
  loan: PublicKey;
  inVault: PublicKey;
  outVault: PublicKey;
  borrowedAmount: BigNumber;
  inAmountJup: BigNumber;
  minSwappedAmount: BigNumber;
  tempValue: BigNumber;
  dataLength: BigNumber;
  jupVec: number[];
  slot: BigNumber;
  createdAt: BigNumber;
  bump: number;
  padding2: number[];
};

export const quoteStruct = new FixableBeetStruct<Quote>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['quoteType', u8],
    ['quoteStep', u8],
    ['padding1', uniformFixedSizeArray(u8, 6)],
    ['quote', publicKey],
    ['payer', publicKey],
    ['borrower', publicKey],
    ['loan', publicKey],
    ['inVault', publicKey],
    ['outVault', publicKey],
    ['borrowedAmount', u64],
    ['inAmountJup', u64],
    ['minSwappedAmount', u64],
    ['tempValue', u64],
    ['dataLength', u64],
    ['jupVec', uniformFixedSizeArray(u8, 512)],
    ['slot', u64],
    ['createdAt', u64],
    ['bump', u8],
    ['padding2', uniformFixedSizeArray(u8, 7)],
  ],
  (args) => args as Quote
);

export type Request = {
  accountDiscriminator: number[];
  payer: PublicKey;
  borrower: PublicKey;
  request: PublicKey;
  collateral: PublicKey;
  principal: PublicKey;
  requestVault: PublicKey;
  collateralAmount: BigNumber;
  principalAmount: BigNumber;
  interest: BigNumber;
  duration: number;
  padding1: number;
  padding2: number;
  bump: number;
  createdAt: BigNumber;
  reserved: number[];
};

export const requestStruct = new FixableBeetStruct<Request>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['payer', publicKey],
    ['borrower', publicKey],
    ['request', publicKey],
    ['collateral', publicKey],
    ['principal', publicKey],
    ['requestVault', publicKey],
    ['collateralAmount', u64],
    ['principalAmount', u64],
    ['interest', u64],
    ['duration', u32],
    ['padding1', u16],
    ['padding2', u8],
    ['bump', u8],
    ['createdAt', u64],
    ['reserved', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as Request
);

export type UserStats = {
  accountDiscriminator: number[];
  owner: PublicKey;
  totalLoan: BigNumber;
  totalLiquidation: BigNumber;
  currentLoan: BigNumber;
  totalVolume: BigNumber;
  points: BigNumber;
  creditScore: BigNumber;
  referrer: PublicKey;
  createdAt: BigNumber;
  bump: number;
  padding1: number[];
  reserved: number[];
};

export const userStatsStruct = new FixableBeetStruct<UserStats>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['owner', publicKey],
    ['totalLoan', u64],
    ['totalLiquidation', u64],
    ['currentLoan', u64],
    ['totalVolume', u64],
    ['points', u64],
    ['creditScore', u64],
    ['referrer', publicKey],
    ['createdAt', u64],
    ['bump', u8],
    ['padding1', uniformFixedSizeArray(u8, 7)],
    ['reserved', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as UserStats
);

export type Vault = {
  accountDiscriminator: number[];
  mint: PublicKey;
  tokenAccount: PublicKey;
  tokenProgram: PublicKey;
  oracles: OracleType[];
  padding1: number[];
  ixGate: BigNumber;
  vaultBump: number;
  tokenAccountBump: number;
  decimals: number;
  padding2: number[];
  deposited: BigNumber;
  maxDeposit: BigNumber;
  withdrawalWindow: BigNumber;
  withdrawalWindowLimit: BigNumber;
  withdrawalWindowStart: BigNumber;
  withdrawalWindowAccumulator: BigNumber;
  createdAt: BigNumber;
  updatedAt: BigNumber;
  depositedAt: BigNumber;
  withdrawnAt: BigNumber;
  reserved: number[];
};

export const vaultStruct = new FixableBeetStruct<Vault>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['mint', publicKey],
    ['tokenAccount', publicKey],
    ['tokenProgram', publicKey],
    ['oracles', uniformFixedSizeArray(u8, 5)],
    ['padding1', uniformFixedSizeArray(u8, 3)],
    ['ixGate', u64],
    ['vaultBump', u8],
    ['tokenAccountBump', u8],
    ['decimals', u8],
    ['padding2', uniformFixedSizeArray(u8, 13)],
    ['deposited', u64],
    ['maxDeposit', u64],
    ['withdrawalWindow', u64],
    ['withdrawalWindowLimit', u64],
    ['withdrawalWindowStart', u64],
    ['withdrawalWindowAccumulator', u64],
    ['createdAt', u64],
    ['updatedAt', u64],
    ['depositedAt', u64],
    ['withdrawnAt', u64],
    ['reserved', uniformFixedSizeArray(u8, 512)],
  ],
  (args) => args as Vault
);

export type ClassicLoan = {
  reserved: number[];
};

export const classicLoanStruct = new FixableBeetStruct<ClassicLoan>(
  [['reserved', uniformFixedSizeArray(u8, 64)]],
  (args) => args as ClassicLoan
);

export type ConditionConfig = {
  minAge: BigNumber;
  minLoan: BigNumber;
  minVolume: BigNumber;
  liquidationThreshold: number;
  isEnabled: number;
  whitelist: PublicKey;
};

export const conditionConfigStruct = new BeetStruct<ConditionConfig>(
  [
    ['minAge', u64],
    ['minLoan', u64],
    ['minVolume', u64],
    ['liquidationThreshold', u16],
    ['isEnabled', u8],
    ['whitelist', publicKey],
  ],
  (args) => args as ConditionConfig
);

export type CurrencyConfig = {
  currency: number;
  currencyLtv: number;
  exposure: number;
};

export const currencyConfigStruct = new BeetStruct<CurrencyConfig>(
  [
    ['currency', u32],
    ['currencyLtv', u16],
    ['exposure', u16],
  ],
  (args) => args as CurrencyConfig
);

export type CurrencyConfigFake = {
  currency: number;
  currencyLtv: number;
  exposure: number;
  borrowedAmount: BigNumber;
};

export const currencyConfigFakeStruct = new BeetStruct<CurrencyConfigFake>(
  [
    ['currency', u32],
    ['currencyLtv', u16],
    ['exposure', u16],
    ['borrowedAmount', u64],
  ],
  (args) => args as CurrencyConfigFake
);

export type CurrencyDeletedEvent = {
  currency: PublicKey;
};

export const currencyDeletedEventStruct = new BeetStruct<CurrencyDeletedEvent>(
  [['currency', publicKey]],
  (args) => args as CurrencyDeletedEvent
);

export type CurveApr = {
  apr: number;
  padding2: number[];
  padding1: BigNumber[];
};

export const curveAprStruct = new FixableBeetStruct<CurveApr>(
  [
    ['apr', u32],
    ['padding2', uniformFixedSizeArray(u8, 4)],
    ['padding1', uniformFixedSizeArray(u64, 9)],
  ],
  (args) => args as CurveApr
);

export type CurveAprConfig = {
  apr: number;
};

export const curveAprConfigStruct = new BeetStruct<CurveAprConfig>(
  [['apr', u32]],
  (args) => args as CurveAprConfig
);

export type Delegator = {
  delegatorType: DelegatorType;
  delegatedAmount: BigNumber;
};

export type EmptyDelegator = {
  reserved: number[];
  reserved1: number[];
  reserved2: number[];
  reserved3: number[];
};

export const emptyDelegatorStruct = new FixableBeetStruct<EmptyDelegator>(
  [
    ['reserved', uniformFixedSizeArray(u8, 32)],
    ['reserved1', uniformFixedSizeArray(u8, 32)],
    ['reserved2', uniformFixedSizeArray(u8, 32)],
    ['reserved3', uniformFixedSizeArray(u8, 24)],
  ],
  (args) => args as EmptyDelegator
);

export type EmptyOracle = {
  reserved: number[];
  reserved1: number[];
  reserved2: number[];
  reserved3: number[];
};

export const emptyOracleStruct = new FixableBeetStruct<EmptyOracle>(
  [
    ['reserved', uniformFixedSizeArray(u8, 32)],
    ['reserved1', uniformFixedSizeArray(u8, 32)],
    ['reserved2', uniformFixedSizeArray(u8, 32)],
    ['reserved3', uniformFixedSizeArray(u8, 24)],
  ],
  (args) => args as EmptyOracle
);

export type LimitConfig = {
  minDuration: number;
  maxDuration: number;
  maxAmountUsd: number;
  minAmountUsd: number;
};

export const limitConfigStruct = new BeetStruct<LimitConfig>(
  [
    ['minDuration', u32],
    ['maxDuration', u32],
    ['maxAmountUsd', u32],
    ['minAmountUsd', u32],
  ],
  (args) => args as LimitConfig
);

export type MarginSwapLoan = {
  downPayment: BigNumber;
  reserved: number[];
  reserved1: number[];
};

export const marginSwapLoanStruct = new FixableBeetStruct<MarginSwapLoan>(
  [
    ['downPayment', u64],
    ['reserved', uniformFixedSizeArray(u8, 32)],
    ['reserved1', uniformFixedSizeArray(u8, 24)],
  ],
  (args) => args as MarginSwapLoan
);

export type MarginfiDelegator = {
  marginfiBank: PublicKey;
  reserved1: number[];
  reserved2: number[];
  reserved3: number[];
};

export const marginfiDelegatorStruct = new FixableBeetStruct<MarginfiDelegator>(
  [
    ['marginfiBank', publicKey],
    ['reserved1', uniformFixedSizeArray(u8, 32)],
    ['reserved2', uniformFixedSizeArray(u8, 32)],
    ['reserved3', uniformFixedSizeArray(u8, 24)],
  ],
  (args) => args as MarginfiDelegator
);

export type PersonalBank = {
  reserved: number[];
  reserved1: number[];
  reserved2: number[];
};

export type PoolCondition = {
  minAge: BigNumber;
  minLoan: BigNumber;
  minVolume: BigNumber;
  unused: BigNumber;
  liquidationThreshold: number;
  isEnabled: number;
  padding1: number[];
  whitelist: PublicKey;
  reserved: BigNumber[];
};

export type PoolCurrency = {
  currency: number;
  currencyLtv: number;
  exposure: number;
  borrowedAmount: BigNumber;
};

export type PoolDeletedEvent = {
  pool: PublicKey;
};

export const poolDeletedEventStruct = new BeetStruct<PoolDeletedEvent>(
  [['pool', publicKey]],
  (args) => args as PoolDeletedEvent
);

export type PoolLimit = {
  minDuration: number;
  maxDuration: number;
  maxAmountUsd: number;
  minAmountUsd: number;
  reserved: BigNumber[];
};

export type PoolLiquidation = {
  loanLiquidation: number;
  mortgageLiquidation: number;
  isAutoSellEnabled: number;
  padding1: number;
  padding2: number;
};

export type PythV2Oracle = {
  feedId: number[];
  reserved: number[];
  reserved1: number[];
  reserved2: number[];
};

export const pythV2OracleStruct = new FixableBeetStruct<PythV2Oracle>(
  [
    ['feedId', uniformFixedSizeArray(u8, 32)],
    ['reserved', uniformFixedSizeArray(u8, 32)],
    ['reserved1', uniformFixedSizeArray(u8, 32)],
    ['reserved2', uniformFixedSizeArray(u8, 24)],
  ],
  (args) => args as PythV2Oracle
);

export type RequestDeletedEvent = {
  request: PublicKey;
};

export const requestDeletedEventStruct = new BeetStruct<RequestDeletedEvent>(
  [['request', publicKey]],
  (args) => args as RequestDeletedEvent
);

export type RequestLoan = {
  reserved: number[];
};

export const requestLoanStruct = new FixableBeetStruct<RequestLoan>(
  [['reserved', uniformFixedSizeArray(u8, 64)]],
  (args) => args as RequestLoan
);

export type SharedBank = {
  lpMint: PublicKey;
  lpRate: BigNumber;
  lpSupply: BigNumber;
  padding1: number[];
  lpDecimals: number;
  padding2: number[];
};

export const sharedBankStruct = new FixableBeetStruct<SharedBank>(
  [
    ['lpMint', publicKey],
    ['lpRate', u128],
    ['lpSupply', u64],
    ['padding1', uniformFixedSizeArray(u8, 8)],
    ['lpDecimals', u8],
    ['padding2', uniformFixedSizeArray(u8, 15)],
  ],
  (args) => args as SharedBank
);

export type SwitchboardOnDemandOracle = {
  account: PublicKey;
  reserved: number[];
  reserved1: number[];
  reserved2: number[];
};

export const switchboardOnDemandOracleStruct =
  new FixableBeetStruct<SwitchboardOnDemandOracle>(
    [
      ['account', publicKey],
      ['reserved', uniformFixedSizeArray(u8, 32)],
      ['reserved1', uniformFixedSizeArray(u8, 32)],
      ['reserved2', uniformFixedSizeArray(u8, 24)],
    ],
    (args) => args as SwitchboardOnDemandOracle
  );

export type SwitchboardOracle = {
  account: PublicKey;
  reserved: number[];
  reserved1: number[];
  reserved2: number[];
};

export const switchboardOracleStruct = new FixableBeetStruct<SwitchboardOracle>(
  [
    ['account', publicKey],
    ['reserved', uniformFixedSizeArray(u8, 32)],
    ['reserved1', uniformFixedSizeArray(u8, 32)],
    ['reserved2', uniformFixedSizeArray(u8, 24)],
  ],
  (args) => args as SwitchboardOracle
);

export type NftLoan = {
  accountDiscriminator: number[];
  kind: LoanKind;
  kindDetail: number[];
  status: LoanStatus;
  isCustom: number;
  padding1: number[];
  borrower: PublicKey;
  bank: PublicKey;
  pool: PublicKey;
  collateral: PublicKey;
  principal: PublicKey;
  referrer: PublicKey;
  interest: BigNumber;
  borrowedAmount: BigNumber;
  duration: number;
  collection: number;
  liquidation: number;
  padding2: number[];
  createdAt: BigNumber;
  expiredAt: BigNumber;
  repaidAt: BigNumber;
  liquidatedAt: BigNumber;
  reserved: BigNumber[];
};

export const nftLoanStruct = new FixableBeetStruct<NftLoan>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['kind', u8],
    ['kind', uniformFixedSizeArray(u8, 64)],
    ['status', u8],
    ['isCustom', u8],
    ['padding1', uniformFixedSizeArray(u8, 6)],
    ['borrower', publicKey],
    ['bank', publicKey],
    ['pool', publicKey],
    ['collateral', publicKey],
    ['principal', publicKey],
    ['referrer', publicKey],
    ['interest', u64],
    ['borrowedAmount', u64],
    ['duration', u32],
    ['collection', u32],
    ['liquidation', u16],
    ['padding2', uniformFixedSizeArray(u8, 6)],
    ['createdAt', u64],
    ['expiredAt', u64],
    ['repaidAt', u64],
    ['liquidatedAt', u64],
    ['reserved', uniformFixedSizeArray(u64, 10)],
  ],
  (args) => args as NftLoan
);
