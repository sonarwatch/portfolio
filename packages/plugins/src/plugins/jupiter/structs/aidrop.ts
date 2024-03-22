import { BeetStruct } from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../../utils/solana';

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
