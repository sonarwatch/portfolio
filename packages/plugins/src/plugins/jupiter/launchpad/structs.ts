import {
  array,
  BeetStruct,
  bool,
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
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

export type PartialUnstake = {
  buffer: Buffer;
  escrow: PublicKey;
  amount: BigNumber;
  expiration: BigNumber;
  buffers: BigNumber[];
  memo: number[];
};
export const partialUnstakeStruct = new FixableBeetStruct<PartialUnstake>(
  [
    ['buffer', blob(8)],
    ['escrow', publicKey],
    ['amount', u64],
    ['expiration', i64],
    ['buffers', uniformFixedSizeArray(u128, 6)],
    ['memo', array(u8)],
  ],
  (args) => args as PartialUnstake
);

export type ClaimStatus = {
  buffer: Buffer;
  claimant: PublicKey;
  lockedAmount: BigNumber;
  lockedAmountWithdrawn: BigNumber;
  unlockedAmount: BigNumber;
  closable: Buffer;
  admin: PublicKey;
};

export const claimStatusStruct = new BeetStruct<ClaimStatus>(
  [
    ['buffer', blob(8)],
    ['claimant', publicKey],
    ['lockedAmount', u64],
    ['lockedAmountWithdrawn', u64],
    ['unlockedAmount', u64],
    ['closable', blob(1)],
    ['admin', publicKey],
  ],
  (args) => args as ClaimStatus
);
