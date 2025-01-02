import {
  BeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type LockUp = {
  buffer: Buffer;
  ns: PublicKey;
  owner: PublicKey;
  amount: BigNumber;
  startTs: BigNumber;
  endTs: BigNumber;
  targetRewardsPct: number;
  targetVotingPct: number;
  padding: number[];
};

export const lockUpStruct = new BeetStruct<LockUp>(
  [
    ['buffer', blob(8)],
    ['ns', publicKey],
    ['owner', publicKey],
    ['amount', u64],
    ['startTs', i64],
    ['endTs', i64],
    ['targetRewardsPct', u16],
    ['targetVotingPct', u16],
    ['padding', uniformFixedSizeArray(u8, 240)],
  ],
  (args) => args as LockUp
);
