import { ParsedAccount } from '../../utils/solana';

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
export type Ammpool = {
  sqrtPrice: number;
  liquidity: number;
  tickCurrentIndex: number;
};
export type Oracle = {
  rate: number;
};
export type YieldMarketWithOracle = YieldMarket & Oracle;
