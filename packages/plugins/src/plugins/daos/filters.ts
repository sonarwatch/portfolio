import { voteStruct, voterStruct } from './structs/realms';

export const voteFilters = (address: string) => [
  { dataSize: voteStruct.byteSize },
  {
    memcmp: {
      offset: 65,
      bytes: address,
    },
  },
];

export const voterFilters = (address: string) => [
  { dataSize: voterStruct.byteSize },
  {
    memcmp: {
      offset: 8,
      bytes: address,
    },
  },
];

export const governanceFilters = () => [
  {
    memcmp: {
      offset: 0,
      bytes: '2',
    },
  },
];

export const registrarFilters = () => [{ dataSize: 880 }];
