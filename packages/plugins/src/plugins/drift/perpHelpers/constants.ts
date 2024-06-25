import BigNumber from 'bignumber.js';
import { BN } from 'bn.js';

export const PRICE_PRECISION_EXP = new BN(6);
export const PRICE_PRECISION = new BN(10).pow(PRICE_PRECISION_EXP);
export const PRICE_PRECISION_BIG_NUMBER = new BigNumber(
  PRICE_PRECISION.toString()
);
export const PEG_PRECISION_EXP = new BN(6);
export const PEG_PRECISION = new BN(10).pow(PEG_PRECISION_EXP);
export const ZERO = new BN(0);
export const ONE = new BN(1);
export const TWO = new BN(2);
export const TEN = new BN(10);
export const AMM_RESERVE_PRECISION_EXP = new BN(9);
export const QUOTE_PRECISION_EXP = new BN(6);
export const QUOTE_PRECISION = new BN(10).pow(QUOTE_PRECISION_EXP);
export const AMM_RESERVE_PRECISION = new BN(10).pow(AMM_RESERVE_PRECISION_EXP);
export const AMM_TO_QUOTE_PRECISION_RATIO =
  AMM_RESERVE_PRECISION.div(QUOTE_PRECISION);
export const PRICE_DIV_PEG = PRICE_PRECISION.div(PEG_PRECISION);
export const BID_ASK_SPREAD_PRECISION = new BN(1000000);
export const PERCENTAGE_PRECISION_EXP = new BN(6);
export const PERCENTAGE_PRECISION = new BN(10).pow(PERCENTAGE_PRECISION_EXP);
export const DEFAULT_REVENUE_SINCE_LAST_FUNDING_SPREAD_RETREAT = new BN(
  -25
).mul(QUOTE_PRECISION);
export const AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO =
  AMM_RESERVE_PRECISION.mul(PEG_PRECISION).div(QUOTE_PRECISION);
export const FIVE_MINUTE = new BN(60 * 5);
export const FUNDING_RATE_BUFFER_PRECISION_EXP = new BN(3);
export const FUNDING_RATE_BUFFER_PRECISION = new BN(10).pow(
  FUNDING_RATE_BUFFER_PRECISION_EXP
);
export const SPOT_MARKET_IMF_PRECISION_EXP = new BN(6);
export const SPOT_MARKET_IMF_PRECISION = new BN(10).pow(
  SPOT_MARKET_IMF_PRECISION_EXP
);
export const SPOT_MARKET_WEIGHT_PRECISION = new BN(10000);
