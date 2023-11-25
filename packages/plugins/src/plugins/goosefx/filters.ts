import { GetProgramAccountsFilter } from '@solana/web3.js';
import { liquidityStruct, userMetadataStruct } from './structs';

export const liquidityAccountFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 72,
      bytes: owner,
    },
  },
  { dataSize: liquidityStruct.byteSize },
];

export const stakingAccountFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
  { dataSize: userMetadataStruct.byteSize },
];
