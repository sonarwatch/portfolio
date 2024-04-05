import { GetProgramAccountsFilter } from '@solana/web3.js';
import { stakeAccountStruct } from './structs';
// import { stakePool } from './constants';

export const stakeAccountStructFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 1,
      bytes: owner,
    },
  },
  { dataSize: stakeAccountStruct.byteSize },
];
