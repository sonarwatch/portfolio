import { SourceRef } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export type LiquidityParams = {
  name?: string;
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
  link?: string;
};
