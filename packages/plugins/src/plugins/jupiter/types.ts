export type CustodyInfo = ParsedCustody & {
  pubkey: string;
};

type ParsedCustody = {
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
  increasePositionBps: string;
  decreasePositionBps: string;
  maxPositionSizeUsd: string;
  dovesOracle: string;
  jumpRateState: JumpRateState;
};

type JumpRateState = {
  minRateBps: string;
  maxRateBps: string;
  targetRateBps: string;
  targetUtilizationRate: string;
};

export type PerpetualPoolInfo = ParsedPerpetualPool & {
  pubkey: string;
};
type ParsedPerpetualPool = {
  buffer: Buffer;
  name: number;
  custodies: string[];
  aumUsd: string;
  fees: ParsedFees;
  maxRequestExecutionSec: string;
  bump: number;
  lpTokenBump: number;
  inceptionTime: string;
};

type ParsedFees = {
  increasePositionBps: string;
  decreasePositionBps: string;
  addRemoveLiquidityBps: string;
  swapBps: string;
  taxBps: string;
  stableSwapBps: string;
  stableSwapTaxBps: string;
  liquidationRewardBps: string;
  protocolShareBps: string;
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
  tradeSpreadLong: string; // tradeImpactFeeScalar
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

export type ClaimProof = {
  merkle_tree: string;
  amount: string;
  proof: number[][];
  mint?: string;
};

export type ClaimProofResponse = ClaimProof | string;

export type AsrResponse = {
  claim: ClaimProof[];
};

export type PriceResponse = {
  data: Record<
    string,
    {
      id: string;
      mintSymbol: string;
      vsToken: string;
      vsTokenSymbol: string;
      price: number;
    } | null
  >;
  timeTaken: number;
};

export type TokenResponse = {
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  daily_volume: number;
  extensions: {
    coingeckoId?: string;
  };
};
