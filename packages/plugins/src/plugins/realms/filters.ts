import { voteAccountStruct, voterStruct } from './structs';

export const voteAccountFilters = (address: string) => [
  { dataSize: voteAccountStruct.byteSize },
  {
    memcmp: {
      offset: 65,
      bytes: address,
    },
  },
];

export const voterAccountFilters = (address: string) => [
  { dataSize: voterStruct.byteSize },
  {
    memcmp: {
      offset: 65,
      bytes: address,
    },
  },
];

export const governanceAccountFilter = () => [
  {
    memcmp: {
      offset: 0,
      bytes: '2',
    },
  },
];
