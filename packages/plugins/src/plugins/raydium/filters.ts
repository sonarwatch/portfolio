import { GetProgramAccountsFilter } from '@solana/web3.js';
import { ammInfoV4Struct, ammInfoV5Struct } from './structs/amms';
import {
  farmAccountV3Struct,
  farmAccountV4Struct,
  farmAccountV5Struct,
  farmAccountV6Struct,
  userFarmAccountV31Struct,
  userFarmAccountV3Struct,
  userFarmAccountV4Struct,
  userFarmAccountV5Struct,
  userFarmAccountV61Struct,
} from './structs/farms';

export const ammV4Filter: GetProgramAccountsFilter[] = [
  { dataSize: ammInfoV4Struct.byteSize },
];

export const ammV5Filter: GetProgramAccountsFilter[] = [
  { dataSize: ammInfoV5Struct.byteSize },
];

export const clmmPoolsStateFilter: GetProgramAccountsFilter[] = [
  { dataSize: 1544 },
];

export const cpmmPoolsStateFilter: GetProgramAccountsFilter[] = [
  { dataSize: 637 },
  {
    memcmp: {
      offset: 0,
      bytes: 'iUE1qg7KXeV',
    },
  },
];

export const stakingFilters = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
  { dataSize: 232 },
];

export const userFarmAccountV3Filters = (
  address: string
): GetProgramAccountsFilter[] => [
  { dataSize: userFarmAccountV3Struct.byteSize },
  {
    memcmp: {
      offset: 40,
      bytes: address,
    },
  },
];

export const userFarmAccountV4Filters = (
  address: string
): GetProgramAccountsFilter[] => [
  { dataSize: userFarmAccountV4Struct.byteSize },
  {
    memcmp: {
      offset: 40,
      bytes: address,
    },
  },
];

export const userFarmAccountV5Filters = (
  address: string
): GetProgramAccountsFilter[] => [
  { dataSize: userFarmAccountV5Struct.byteSize },
  {
    memcmp: {
      offset: 40,
      bytes: address,
    },
  },
];

export const userFarmAccountV51Filters = (
  address: string
): GetProgramAccountsFilter[] => [
  { dataSize: userFarmAccountV4Struct.byteSize },
  {
    memcmp: {
      offset: 40,
      bytes: address,
    },
  },
];

export const userFarmAccountV31Filters = (
  address: string
): GetProgramAccountsFilter[] => [
  { dataSize: userFarmAccountV31Struct.byteSize },
  {
    memcmp: {
      offset: 40,
      bytes: address,
    },
  },
];

export const userFarmAccountV61Filters = (
  address: string
): GetProgramAccountsFilter[] => [
  { dataSize: userFarmAccountV61Struct.byteSize },
  {
    memcmp: {
      offset: 48,
      bytes: address,
    },
  },
];

export const farmAccountV3Filters = [
  { dataSize: farmAccountV3Struct.byteSize },
];
export const farmAccountV4Filters = [
  { dataSize: farmAccountV4Struct.byteSize },
];
export const farmAccountV5Filters = [
  { dataSize: farmAccountV5Struct.byteSize },
];
export const farmAccountV6Filters = [
  { dataSize: farmAccountV6Struct.byteSize },
];
