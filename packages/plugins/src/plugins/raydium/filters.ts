import { GetProgramAccountsFilter } from '@solana/web3.js';
import { ammInfoV4Struct, ammInfoV5Struct } from './structs/amms';

export const ammV4Filter: GetProgramAccountsFilter[] = [
  { dataSize: ammInfoV4Struct.byteSize },
];

export const ammV5Filter: GetProgramAccountsFilter[] = [
  { dataSize: ammInfoV5Struct.byteSize },
];

export const clmmPoolsStateFilter: GetProgramAccountsFilter[] = [
  { dataSize: 1544 },
];

export const cpmmPoolsStateFilter: GetProgramAccountsFilter[] = [
  { dataSize: 637 },
];

export const stakingFilters = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
  { dataSize: 232 },
];
