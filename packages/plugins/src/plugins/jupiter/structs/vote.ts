import {
  BeetStruct,
  bool,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@metaplex-foundation/js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../../utils/solana';

export type Escrow = {
  buffer: Buffer;
  locker: PublicKey;
  owner: PublicKey;
  bump: number;
  tokens: PublicKey;
  amount: BigNumber;
  escrowStartedAt: BigNumber;
  escrowEndsAt: BigNumber;
  voteDelegate: PublicKey;
  isMaxLock: boolean;
  buffers: BigNumber[];
};

export const escrowStruct = new BeetStruct<Escrow>(
  [
    ['buffer', blob(8)],
    ['locker', publicKey],
    ['owner', publicKey],
    ['bump', u8],
    ['tokens', publicKey],
    ['amount', u64],
    ['escrowStartedAt', i64],
    ['escrowEndsAt', i64],
    ['voteDelegate', publicKey],
    ['isMaxLock', bool],
    ['buffers', uniformFixedSizeArray(u128, 10)],
  ],
  (args) => args as Escrow
);
