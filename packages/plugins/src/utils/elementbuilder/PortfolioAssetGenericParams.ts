import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { PortfolioAssetAttributes } from '@sonarwatch/portfolio-core';

export type PortfolioAssetGenericParams = {
  address?: string | PublicKey;
  amount?: number | BigNumber | string;
  price?: number | BigNumber;
  attributes?: PortfolioAssetAttributes;
  value?: number | BigNumber;
  name?: string;
};
