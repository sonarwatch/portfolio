import {
  PortfolioElementLabel,
  PortfolioElementTypeType,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export type ElementParams = {
  type: PortfolioElementTypeType;
  label: PortfolioElementLabel;
  name?: string;
  tags?: string[];
  platformId?: string;
  pool?: string | PublicKey;
  id?: string | PublicKey;
};
