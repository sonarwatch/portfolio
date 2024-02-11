import { GetProgramAccountsFilter } from '@solana/web3.js';
import { stakeDepositReceiptStruct } from './structs';
import { stakePool } from './constants';

export const stakeDepositReceiptFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
  {
    memcmp: {
      offset: 72,
      bytes: stakePool,
    },
  },
  { dataSize: stakeDepositReceiptStruct.byteSize },
];
