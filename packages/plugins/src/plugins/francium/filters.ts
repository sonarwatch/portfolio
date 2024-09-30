import { rewardAccountStruct } from './structs';

export const rewardUserAccountFilter = (userAddress: string) => [
  // {
  //   memcmp: {
  //     offset: 169,
  //     bytes: userAddress,
  //   },
  // },
  {
    dataSize: 313,
  },
];
