import { GetProgramAccountsFilter } from '@solana/web3.js';
import { loanDataSize } from './constants';

export function getLoanFilters(
  owner: string
): [
  GetProgramAccountsFilter[],
  GetProgramAccountsFilter[],
  GetProgramAccountsFilter[]
] {
  return [
    [
      {
        dataSize: loanDataSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 115,
        },
      },
    ],
    [
      {
        dataSize: loanDataSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 147,
        },
      },
    ],
    [
      {
        dataSize: loanDataSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 83,
        },
      },
    ],
  ];
}
