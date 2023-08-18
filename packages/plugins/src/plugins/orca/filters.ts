import { GetProgramAccountsFilter } from '@solana/web3.js';
import { aquafarmStruct } from './structs/oldLiquidities';
import { whirlpoolStruct } from './structs/whirlpool';

export const aquafarmFilters: GetProgramAccountsFilter[] = [
  { dataSize: aquafarmStruct.byteSize },
];

export const poolsFilters: GetProgramAccountsFilter[] = [{ dataSize: 324 }];

export const whirlpoolFilters: GetProgramAccountsFilter[] = [
  { dataSize: whirlpoolStruct.byteSize },
];
