export type ReservesResponse = ReserveApi[];

export type ReserveEnhanced = Reserve & {
  depositApy?: string;
  borrowApy?: string;
};

export type ReserveApi = {
  reserveId: string;
  assetMintId: string;
  shareMintId: string;
  oracleId: string;
  shareBalanceId: string;
  liquidityBalanceId: string;
  availableLiquidity: string;
  borrowedLiquidity: string;
  totalLiquidity: string;
  issuedShare: string;
  exchangeRatio: string;
  depositApy: string;
  borrowApy: string;
  stakingPool: string;
  minBorrowRate: string;
  maxBorrowRate: string;
  optimalBorrowRate: string;
  optimalUtilisation: string;
};

export type Fees = {
  borrowFeeWad: string;
  flashLoanFeeWad: string;
  hostFeePercentage: number;
};

export type ReserveConfig = {
  optimalUtilizationRate: number;
  loanToValueRatio: number;
  liquidationBonus: number;
  liquidationThreshold: number;
  minBorrowRate: number;
  optimalBorrowRate: number;
  maxBorrowRate: number;
  fees: Fees;
};

export type Collateral = {
  mintPubkey: string;
  mintTotalSupply: string;
  supplyPubkey: string;
};

export type Liquidity = {
  mintPubkey: string;
  mintDecimals: number;
  supplyPubkey: string;
  feeReceiver: string;
  oracleOption: string;
  oraclePubkey: string;
  availableAmount: string;
  borrowedAmountWads: string;
  cumulativeBorrowRateWads: string;
  marketPrice: string;
};

export type LastUpdate = {
  slot: string;
  stale: number;
};

export type Reserve = {
  pubkey: string;
  version: number;
  lastUpdate: LastUpdate;
  lendingMarket: string;
  liquidity: Liquidity;
  collateral: Collateral;
  config: ReserveConfig;
  padding: string;
};
