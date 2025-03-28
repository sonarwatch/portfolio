import BigNumber from 'bignumber.js';
import { YieldMarket } from './structs';

export type Program = {
  programId: string;
  mint: string;
};

export type PtToken = {
  pt_mint: string;
  pt_price: number;
  pt_u_price: number;
  pt_yield: number;
  security_id: string;
};

export type YieldMarketWithOracle = YieldMarket & {
  rate: BigNumber;
};
