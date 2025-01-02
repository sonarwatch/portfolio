import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type UserState = {
  buffer: Buffer;
  initializerUser: PublicKey;
  poolAddress: PublicKey;
  stakedTokenBalance: BigNumber;
  stakedTokenWeight: BigNumber;
  rewardPerWeightPaid: BigNumber;
  rewards: BigNumber;
  autoCompound: BigNumber;
  releaseTime: BigNumber;
  lastRewardGetTime: BigNumber;
  randomSeed: number[];
  userStateBump: number;
};

export const userStateStruct = new BeetStruct<UserState>(
  [
    ['buffer', blob(8)],
    ['initializerUser', publicKey],
    ['poolAddress', publicKey],
    ['stakedTokenBalance', u128],
    ['stakedTokenWeight', u128],
    ['rewardPerWeightPaid', u128],
    ['rewards', u64],
    ['autoCompound', i64],
    ['releaseTime', i64],
    ['lastRewardGetTime', i64],
    ['randomSeed', uniformFixedSizeArray(u8, 16)],
    ['userStateBump', u8],
  ],
  (args) => args as UserState
);
