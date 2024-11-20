import { OracleType } from '../jupiter/exchange/structs';
import { Custody, FeesMode } from './structs';

export type MarketInfo = {
  pubkey: string;
  pool: string;
  targetCustody: string;
  targetCustodyAccount: CustodyInfo;
  collateralCustody: string;
  collateralCustodyAccount: CustodyInfo;
  side: string;
  correlation: string;
  maxPayoffBps: string;
  permissions: string;
  openInterest: string;
  collectivePosition: string;
  targetCustodyId: string;
  collateralCustodyId: string;
  bump: string;
};

type RatioFees = {
  minFee: string;
  targetFee: string;
  maxFee: string;
};

type Fees = {
  mode: FeesMode;
  swapIn: RatioFees;
  swapOut: RatioFees;
  stableSwapIn: RatioFees;
  stableSwapOut: RatioFees;
  addLiquidity: RatioFees;
  removeLiquidity: RatioFees;
  openPosition: string;
  closePosition: string;
  removeCollateral: string;
};

type OracleParams = {
  oracleAccount: string;
  customOracleAccount: string;
  oracleType: OracleType;
  maxDivergenceBps: string;
  maxConfBps: string;
  maxPriceAgeSec: string;
};

type PricingParams = {
  tradeSpreadLong: string;
  tradeSpreadShort: string;
  swapSpread: string;
  maxLeverage: string;
  maxGlobalLongSizes: string;
  maxGlobalShortSizes: string;
};

type BorrowRateParams = {
  baseRate: string;
  slope1: string;
  slope2: string;
  optimalUtilization: string;
};

type Assets = {
  collateral: string;
  owned: string;
  locked: string;
};

type FeesStats = {
  accrued: string;
  distributed: string;
  paid: string;
  rewardPerLpStaked: string;
  protocolFee: string;
};

type BorrowRateState = {
  currentRate: string;
  cumulativeLockFee: string;
  lastUpdate: string;
};

export type CustodyEnhanced = Custody & { pubkey: string };

export type CustodyInfo = {
  pubkey: string;
  pool: string;
  mint: string;
  tokenAccount: string;
  decimals: string;
  isStable: string;
  depegAdjustment: string;
  isVirtual: string;
  distributeRewards: string;
  oracle: OracleParams;
  pricing: PricingParams;
  permissions: Permissions;
  fees: Fees;
  borrowRate: BorrowRateParams;
  rewardThreshold: string;
  assets: Assets;
  feesStats: FeesStats;
  borrowRateState: BorrowRateState;
  bump: string;
  tokenAccountBump: string;
};

export type PoolInfo = {
  pkey: string;
  flpMint: string;
  rewardPerLp: number;
  compoundingMint: string;
};

export type Prefix = {
  keys: any[];
  programId: string;
  data: number[];
};
