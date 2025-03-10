import { BeetStruct, u32 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type UserInfo = {
  buffer: Buffer;
  address: PublicKey;
  amount: BigNumber;
  updatedTime: BigNumber;
  claimableAmount: BigNumber;
  claimCount: number;
  rewardPendingPuffHour: BigNumber;
  rewardLastUpdatedTime: BigNumber;
};

export const userInfoStruct = new BeetStruct<UserInfo>(
  [
    ['buffer', blob(8)],
    ['address', publicKey],
    ['amount', u64],
    ['updatedTime', i64],
    ['claimableAmount', u64],
    ['claimCount', u32],
    ['rewardPendingPuffHour', u64],
    ['rewardLastUpdatedTime', i64],
  ],
  (args) => args as UserInfo
);
