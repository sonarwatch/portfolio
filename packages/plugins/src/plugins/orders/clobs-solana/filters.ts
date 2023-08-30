import { GetProgramAccountsFilter } from '@solana/web3.js';
import { BeetStruct } from '@metaplex-foundation/beet';
import { CLOBOrderStruct } from './structs';

export const serumOrdersFilter = (
  owner: string,
  struct: BeetStruct<CLOBOrderStruct>
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 45,
      bytes: owner,
    },
  },
  {
    dataSize: struct.byteSize,
  },
];
