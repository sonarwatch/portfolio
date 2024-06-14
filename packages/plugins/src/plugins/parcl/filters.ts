import { GetProgramAccountsFilter } from '@solana/web3.js';
import { marginAccountStruct } from './structs';

// export const lpAccountFilter = (owner: string): GetProgramAccountsFilter[] => [
//   {
//     memcmp: {
//       offset: 64,
//       bytes: owner,
//     },
//   },
//   {
//     dataSize: lpAccountStruct.byteSize,
//   },
// ];

// export const lpPositionFilter = (owner: string): GetProgramAccountsFilter[] => [
//   {
//     memcmp: {
//       offset: 72,
//       bytes: owner,
//     },
//   },
//   {
//     dataSize: lpPositionStruct.byteSize,
//   },
// ];

// export const settlementRequestFilter = (
//   owner: string
// ): GetProgramAccountsFilter[] => [
//   {
//     memcmp: {
//       offset: 72,
//       bytes: owner,
//     },
//   },
//   {
//     dataSize: settlementRequestStruct.byteSize,
//   },
// ];

export const marginAccountFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 828,
      bytes: owner,
    },
  },
  {
    dataSize: marginAccountStruct.byteSize,
  },
];
