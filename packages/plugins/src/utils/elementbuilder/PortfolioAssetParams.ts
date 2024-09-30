import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';

export type PortfolioAssetParams = {
  address: string | PublicKey;
  amount: number | BigNumber | string;
  alreadyShifted?: boolean;
};
