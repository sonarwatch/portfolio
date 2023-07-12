import { GetProgramAccountsFilter } from '@solana/web3.js';
import { ammInfoV4Struct, ammInfoV5Struct } from './structs';

export const ammV4Filter: GetProgramAccountsFilter[] = [{ dataSize: 752 }];

export const ammV5Filter: GetProgramAccountsFilter[] = [
  { dataSize: ammInfoV5Struct.byteSize },
];
