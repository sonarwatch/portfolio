import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type Locker = {
  buffer: Buffer;
  locker: PublicKey;
  escrow: PublicKey;
  vault: PublicKey;
  escrowOwner: PublicKey;
  sourceAuthority: PublicKey;
  sourceTokens: PublicKey;
  tokenProgram: PublicKey;
};

export const lockerStruct = new BeetStruct<Locker>(
  [
    ['buffer', blob(8)],
    ['locker', publicKey],
    ['escrow', publicKey],
    ['vault', publicKey],
    ['escrowOwner', publicKey],
    ['sourceAuthority', publicKey],
    ['sourceTokens', publicKey],
    ['tokenProgram', publicKey],
  ],
  (args) => args as Locker
);

export type Escrow = {
  buffer: Buffer;
  locker: PublicKey;
  owner: PublicKey;
  bump: number;
  amount: BigNumber;
  escrowStartedAt: BigNumber;
  escrowEndsAt: BigNumber;
  initialAmount: BigNumber;
  duration: BigNumber;
  voteDelegate: PublicKey;
  reserved1: number[];
  reserved2: number[];
};

export const escrowStruct = new BeetStruct<Escrow>(
  [
    ['buffer', blob(8)],
    ['locker', publicKey],
    ['owner', publicKey],
    ['bump', u8],
    ['amount', u64],
    ['escrowStartedAt', i64],
    ['escrowEndsAt', i64],
    ['initialAmount', i64],
    ['duration', i64],
    ['voteDelegate', publicKey],
    ['reserved1', uniformFixedSizeArray(u8, 15)],
    ['reserved2', uniformFixedSizeArray(u8, 32)],
  ],
  (args) => args as Escrow
);
