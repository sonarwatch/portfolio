import {
  PortfolioElementLabel,
  PortfolioElementTypeType,
  SourceRef,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export type ElementParams = {
  type: PortfolioElementTypeType;
  label: PortfolioElementLabel;
  name?: string;
  tags?: string[];
  platformId?: string;
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
};
