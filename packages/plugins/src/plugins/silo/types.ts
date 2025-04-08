import BigNumber from 'bignumber.js';
import { Address } from 'viem';

export type SiloPool = {
  address: Address;
  vault: Address;
  category: 'lend' | 'borrow';
  asset: string;
  underlyingAsset?: string;
  conversionRate?: BigNumber;
};

export type SiloVaultsResponse = {
  silos: {
    id: string;
    totalValueLockedUSD: string;
    totalBorrowBalanceUSD: string;
    totalDepositBalanceUSD: string;
    market: {
      dToken: {
        id: string;
      };
      spToken: {
        id: string;
      };
      sToken: {
        id: string;
      };
    }[];
  }[];
  tokens: {
    id: string;
  }[];
};
