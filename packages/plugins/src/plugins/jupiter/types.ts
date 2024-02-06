export type CustodyInfo = Custody & {
  pubkey: string;
};

type Custody = {
  buffer: Buffer;
  pool: string;
  mint: string;
  tokenAccount: string;
  decimals: number;
  isStable: boolean;
  oracle: OracleParams;
  pricing: PricingParams;
  permissions: Permission;
  targetRatioBps: string;
  assets: Assets;
  fundingRateState: FundingRateState;
  bump: number;
  tokenAccountBump: number;
};

enum OracleType {
  None,
  Test,
  Pyth,
}

type OracleParams = {
  oracleAccount: string;
  oracleType: OracleType;
  maxPriceError: string;
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

type Permission = {
  allowSwap: boolean;
  allowAddLiquidity: boolean;
  allowRemoveLiquidity: boolean;
  allowIncreasePosition: boolean;
  allowDecreasePosition: boolean;
  allowCollateralWithdrawal: boolean;
  allowLiquidatePosition: boolean;
};

type Assets = {
  feesReserves: string;
  owned: string;
  locked: string;
  guaranteedUsd: string;
  globalShortSizes: string;
  globalShortAveragePrices: string;
};

type FundingRateState = {
  cumulativeInterestRate: string;
  lastUpdate: string;
  hourlyFundingBps: string;
};

export type ClaimProofResponse = {
  merkle_tree: string;
  amount: string;
  proof: number[][];
};
