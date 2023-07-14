import { GetProgramAccountsFilter } from '@solana/web3.js';
import { aquafarmStruct } from './structs/aquafarms';
import { whirlpoolStruct } from './structs/whirlpool';

export const aquafarmFilters: GetProgramAccountsFilter[] = [
  { dataSize: aquafarmStruct.byteSize },
];

export const whirlpoolFilters: GetProgramAccountsFilter[] = [
  { dataSize: whirlpoolStruct.byteSize },
];
