import { GetProgramAccountsFilter } from '@solana/web3.js';
import { spotMarketStruct } from './struct';

export const accountsFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 0,
      bytes: 'TfwwBiNJtao',
    },
  },
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
];

export const marketFilter: GetProgramAccountsFilter[] = [
  { dataSize: spotMarketStruct.byteSize },
];
