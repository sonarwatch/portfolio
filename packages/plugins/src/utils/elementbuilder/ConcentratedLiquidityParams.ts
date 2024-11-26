import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';

export type ConcentratedLiquidityParams = {
  addressA: string | PublicKey;
  addressB: string | PublicKey;
  liquidity: number | BigNumber | string;
  tickCurrentIndex: number | BigNumber | string;
  tickLowerIndex: number | BigNumber | string;
  tickUpperIndex: number | BigNumber | string;
  currentSqrtPrice?: number | BigNumber | string;
  poolLiquidity?: number | BigNumber | string;
  feeRate?: number | BigNumber | string; // 0.01 for 1%
  swapVolume24h?: number | BigNumber | string; // in $
  roundUp?: boolean;
  name?: string;
};
