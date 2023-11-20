import { BeetStruct } from '@metaplex-foundation/beet';
import { GetProgramAccountsFilter } from '@solana/web3.js';

/**
 * Return a GetProgramAccountsFilter with dataSize parameter set to the byteSize of the struct provided.
 *
 * @param struct a BeetStruct.
 *
 * @returns GetProgramAccountsFilter
 */
export const dataStructSizeFilter = (
  struct: BeetStruct<unknown>
): GetProgramAccountsFilter[] => [
  {
    dataSize: struct.byteSize,
  },
];

export const dataSizeFilter = (size: number): GetProgramAccountsFilter[] => [
  {
    dataSize: size,
  },
];
