export type State = {
  marketIndexStart: number;
};
export type MarginMarket = {
  pubkey: string;
  mint: string;
};
export type Program = {
  programId: string;
  mint: string;
};
export type UserStats = {
  numberOfSubAccountsCreated: number;
};
export type User = {
  marginPositions: MarginPosition[];
};
export type MarginPosition = {
  balance: number;
  marketIndex: number;
  decimals: number;
};
export type LP = {
  ammPosition: AmmPosition;
  reserveQuoteAmount: number;
  reserveBaseAmount: number;
};
export type AmmPosition = {
  ammpool: string;
  liquidity: number;
  tickLowerIndex: number;
  tickUpperIndex: number;
  lowerRate: number;
  upperRate: number;
  feeGrowthCheckpointA: number;
  feeOwedA: number;
  feeGrowthCheckpointB: number;
  feeOwedB: number;
};
export type YieldMarket = {
  pubkey: string;
  oracle: string;
  pool: Ammpool;
  lpMarginIndex: number;
  lpMarginDecimals: number;
};
export type AmmpoolRewardInfo = {
  mint: string;
  vault: string;
  authority: string;
  emissionsPerSecondX64: number;
  growthGlobalX64: number;
};
export type Ammpool = {
  ammpoolsConfig: string;
  liquidity: number;
  sqrtPrice: number;
  protocolFeeOwedA: number;
  protocolFeeOwedB: number;
  tokenMintBase: string;
  tokenVaultBase: string;
  feeGrowthGlobalA: number;
  tokenMintQuote: string;
  tokenVaultQuote: string;
  feeGrowthGlobalB: number;
  rewardLastUpdatedTimestamp: number;
  rewardInfos: AmmpoolRewardInfo[];
  oracle: string;
  tickCurrentIndex: number;
  observationIndex: number;
  observationUpdateDuration: number;
  tickSpacing: number;
  tickSpacingSeed: number[];
  feeRate: number;
  protocolFeeRate: number;
};

export type Oracle = {
  rate: number;
};
export type YieldMarketWithOracle = YieldMarket & Oracle;

export type PtToken = {
  pt_mint: string;
  pt_price: number;
  pt_u_price: number;
  pt_yield: number;
  security_id: string;
};
