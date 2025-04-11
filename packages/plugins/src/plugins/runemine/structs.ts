import {
  BeetStruct,
  bool,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { u128, u64 } from '../../utils/solana';

// Type for User
export type User = {
  accountDiscriminator: number[];
  bump: number;
  initialized: boolean;
  amount: BigNumber;
  score: BigNumber;
  rewards: BigNumber;
  userRewardsIndex: BigNumber;
  start: BigNumber;
  time: BigNumber;
};

// Struct for User
export const userStruct = new BeetStruct<User>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['initialized', bool],
    ['amount', u64],
    ['score', u64],
    ['rewards', u64],
    ['userRewardsIndex', u128],
    ['start', u64],
    ['time', u64],
  ],
  (args) => args as User
);
