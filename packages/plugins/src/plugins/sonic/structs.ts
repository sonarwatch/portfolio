import {
  bool,
  FixableBeetStruct,
  u16,
  u32,
  u8,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export enum StakeTypeEnum {
  Airdrop,
  Wallet,
}

export type UserStakeIndex = {
  buffer: Buffer;
  lastBlockTimestamp: BigNumber;
  startAt: BigNumber;
  endAt: BigNumber;
  withdrawAt: BigNumber;
  amount: BigNumber;
  reward: BigNumber;
  enable: boolean;
  isWithdraw: boolean;
  rate: number;
  stakeType: StakeTypeEnum;
  user: PublicKey;
  index: number;
};

export const userStakeIndexStruct = new FixableBeetStruct<UserStakeIndex>(
  [
    ['buffer', blob(8)],
    ['lastBlockTimestamp', i64],
    ['startAt', i64],
    ['endAt', i64],
    ['withdrawAt', i64],
    ['amount', u64],
    ['reward', u64],
    ['enable', bool],
    ['isWithdraw', bool],
    ['rate', u16],
    ['stakeType', u8],
    ['user', publicKey],
    ['index', u32],
  ],
  (args) => args as UserStakeIndex
);
