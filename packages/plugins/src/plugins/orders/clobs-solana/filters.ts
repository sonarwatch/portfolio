import { GetProgramAccountsFilter } from '@solana/web3.js';
import { BeetStruct } from '@metaplex-foundation/beet';
import { CLOBMarketAccount, openOrdersV2Struct } from './structs';

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

export const dataSizeStructFilter = (
  struct: BeetStruct<CLOBMarketAccount>
): GetProgramAccountsFilter[] => [
  {
    dataSize: struct.byteSize,
  },
];
