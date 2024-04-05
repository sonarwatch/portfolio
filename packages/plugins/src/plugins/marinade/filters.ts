import { GetProgramAccountsFilter } from '@solana/web3.js';
import { claimRecordStruct, ticketStruct } from './structs';

export const ticketFilters = (owner: string): GetProgramAccountsFilter[] => [
  { dataSize: ticketStruct.byteSize },
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
];

export const claimRecordFilters = (
  owner: string
): GetProgramAccountsFilter[] => [
  { dataSize: claimRecordStruct.byteSize },
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
];
