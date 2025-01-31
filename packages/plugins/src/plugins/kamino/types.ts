import {
  BigFractionBytes,
  BorrowRateCurve,
  LastUpdate,
  Reserve,
  ReserveFees,
  TokenInfo,
  WithdrawalCaps,
} from './structs/klend';

export type ReserveDataEnhanced = ReserveData & {
  supplyApr: number;
  borrowApr: number;
  exchangeRate: number;
  cumulativeBorrowRate: string;
};

export type ReserveEnhanced = Reserve & {
  supplyApr: number;
  borrowApr: number;
  exchangeRate: number;
  cumulativeBorrowRate: string;
};

export type ReserveConfig = {
  status: number;
  assetTier: number;
  reserved0: number[];
  multiplierSideBoost: number[];
  multiplierTagBoost: number[];
  protocolTakeRatePct: number;
  protocolLiquidationFeePct: number;
  loanToValuePct: number;
  liquidationThresholdPct: number;
  minLiquidationBonusBps: number;
  maxLiquidationBonusBps: number;
  badDebtLiquidationBonusBps: number;
  deleveragingMarginCallPeriodSecs: string;
  deleveragingThresholdSlotsPerBps: string;
  fees: ReserveFees;
  borrowRateCurve: BorrowRateCurve;
  borrowFactorPct: string;
  depositLimit: string;
  borrowLimit: string;
  tokenInfo: TokenInfo;
  depositWithdrawalCap: WithdrawalCaps;
  debtWithdrawalCap: WithdrawalCaps;
  elevationGroups: number[];
  reserved1: number[];
};

export type ReserveCollateral = {
  mintPubkey: string;
  mintTotalSupply: string;
  supplyVault: string;
  padding1: string[];
  padding2: string[];
};

export type ReserveLiquidity = {
  mintPubkey: string;
  supplyVault: string;
  feeVault: string;
  availableAmount: string;
  borrowedAmountSf: string;
  marketPriceSf: string;
  marketPriceLastUpdatedTs: string;
  mintDecimals: string;
  depositLimitCrossedSlot: string;
  borrowLimitCrossedSlot: string;
  cumulativeBorrowRateBsf: BigFractionBytes;
  accumulatedProtocolFeesSf: string;
  accumulatedReferrerFeesSf: string;
  pendingReferrerFeesSf: string;
  absoluteReferralRateSf: string;
  padding2: string[];
  padding3: string[];
};

export type ReserveData = {
  buffer: Buffer;
  version: string;
  lastUpdate: LastUpdate;
  lendingMarket: string;
  farmCollateral: string;
  farmDebt: string;
  liquidity: ReserveLiquidity;
  reserveLiquidityPadding: string[];
  collateral: ReserveCollateral;
  reserveCollateralPadding: string[];
  config: ReserveConfig;
  configPadding: string[];
  padding: string[];
};

export type FarmInfo = {
  pubkey: string;
  mint: string;
  decimals: number;
  price: number;
  rewardsMints: string[];
  lockingStart: number;
  lockingDuration: number;
  strategyId: string;
};

export type LendingMarketConfig = {
  name: string;
  multiplyPairs?: string[][];
  leveragePairs?: string[][];
};

export type AllocationsApiRes = { quantity: string; name: string }[];
