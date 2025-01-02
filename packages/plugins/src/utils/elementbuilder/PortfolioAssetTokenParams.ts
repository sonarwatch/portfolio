import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { PortfolioAssetAttributes } from '@sonarwatch/portfolio-core';

export type PortfolioAssetTokenParams = {
  address: string | PublicKey;
  amount: number | BigNumber | string;
  attributes?: PortfolioAssetAttributes;
  alreadyShifted?: boolean;
};
