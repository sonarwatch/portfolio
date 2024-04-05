import { GetProgramAccountsFilter } from '@solana/web3.js';
import { fundStruct } from './structs';

export const fundFilters: GetProgramAccountsFilter[] = [
  { dataSize: fundStruct.byteSize },
  { memcmp: { offset: 112, bytes: '11111111' } },
];
