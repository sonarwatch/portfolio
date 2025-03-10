import { stakeStruct, unstakeStruct } from './structs';

export const stakeAccountFilters = (owner: string) => [
  {
    memcmp: {
      offset: 16,
      bytes: owner,
    },
  },
  {
    memcmp: {
      offset: 0,
      bytes: 'EV6feDfKSVt',
    },
  },
  {
    dataSize: stakeStruct.byteSize,
  },
];

export const unstakeAccountFilters = (owner: string) => [
  {
    memcmp: {
      offset: 16,
      bytes: owner,
    },
  },
  {
    memcmp: {
      offset: 0,
      bytes: '8fHY7z1kRxS',
    },
  },
  {
    dataSize: unstakeStruct.byteSize,
  },
];
