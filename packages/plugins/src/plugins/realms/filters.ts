import { voteStruct, voterStruct } from './structs/realms';

export const voteAccountFilters = (address: string) => [
  { dataSize: voteStruct.byteSize },
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
      offset: 8,
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
