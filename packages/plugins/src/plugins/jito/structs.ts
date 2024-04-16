import { BeetStruct } from '@metaplex-foundation/beet';
import { PublicKey } from '@metaplex-foundation/js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

export type ClaimStatus = {
  buffer: Buffer;
  claimant: PublicKey;
  lockedAmount: BigNumber;
  lockedAmountWithdrawn: BigNumber;
  unlockedAmount: BigNumber;
};

export const claimStatusStruct = new BeetStruct<ClaimStatus>(
  [
    ['buffer', blob(8)],
    ['claimant', publicKey],
    ['lockedAmount', u64],
    ['lockedAmountWithdrawn', u64],
    ['unlockedAmount', u64],
  ],
  (args) => args as ClaimStatus
);
