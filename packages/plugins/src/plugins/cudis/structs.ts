import {
  BeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { i64, u64 } from '../../utils/solana';

export type UserStakeRecord = {
  discriminator: number[];
  recordId: number;
  user: PublicKey;
  amount: BigNumber;
  term: number;
  apy: BigNumber;
  earnings: BigNumber;
  startTs: BigNumber;
  endTs: BigNumber;
  isUnstake: boolean;
  bump: number;
};

export const userStakeRecordStruct = new BeetStruct<UserStakeRecord>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['recordId', u8],
    ['user', publicKey],
    ['amount', u64],
    ['term', u16],
    ['apy', u64],
    ['earnings', u64],
    ['startTs', i64],
    ['endTs', i64],
    ['isUnstake', u8], // bool is represented as u8 in Beet
    ['bump', u8],
  ],
  (args) => args as UserStakeRecord
);
