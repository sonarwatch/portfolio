import { GetProgramAccountsFilter } from '@solana/web3.js';
import { ticketStruct } from './structs';

export const ticketFilters = (owner: string): GetProgramAccountsFilter[] => [
  { dataSize: ticketStruct.byteSize },
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
];
