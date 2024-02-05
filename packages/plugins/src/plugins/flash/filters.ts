import { GetProgramAccountsFilter } from '@solana/web3.js';
import { marketStruct } from './structs';

export const perpetualsPositionsFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
  { dataSize: 256 },
];

export const marketsFilter = (): GetProgramAccountsFilter[] => [
  { dataSize: marketStruct.byteSize },
];
