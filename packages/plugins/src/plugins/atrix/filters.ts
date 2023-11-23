import { farmStruct, stakerStruct } from './structs';

export const stakerAccountFilter = () => [
  {
    //   memcmp: {
    //     offset: 41, // 32+8+1
    //     bytes: owner,
    //   },
    // },
    // {
    dataSize: stakerStruct.byteSize,
  },
];

export const farmAccountFilter = () => [
  {
    //   memcmp: {
    //     offset: 41, // 32+8+1
    //     bytes: owner,
    //   },
    // },
    // {
    dataSize: farmStruct.byteSize,
  },
];
