import { GetProgramAccountsFilter } from '@solana/web3.js';
import { loanDataSize } from './constants';

export function getLoanFilters(
  owner: string
): [GetProgramAccountsFilter[], GetProgramAccountsFilter[]] {
  return [
    [
      {
        dataSize: loanDataSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 9,
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
          offset: 41,
        },
      },
    ],
  ];
}
