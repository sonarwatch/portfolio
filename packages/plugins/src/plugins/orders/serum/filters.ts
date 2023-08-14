import { GetProgramAccountsFilter } from '@solana/web3.js';
import { openOrdersV2Struct } from '../../raydium/structs/openOrders';

export const serumOrdersV2Filter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 45,
      bytes: owner,
    },
  },
  {
    dataSize: openOrdersV2Struct.byteSize,
  },
];
