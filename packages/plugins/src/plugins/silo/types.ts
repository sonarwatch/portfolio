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
