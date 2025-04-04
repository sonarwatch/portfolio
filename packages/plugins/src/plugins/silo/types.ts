import BigNumber from 'bignumber.js';

export type SiloPool = {
  address: string;
  vault: string;
  category: 'lend' | 'borrow';
  asset: string;
  underlyingAsset?: string;
  conversionRate?: BigNumber;
};
