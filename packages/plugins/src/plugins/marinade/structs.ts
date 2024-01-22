import BigNumber from 'bignumber.js';
import { BeetStruct } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';

import { blob, u64 } from '../../utils/solana';

export type Ticket = {
  padding: Buffer;
  stateAddress: PublicKey;
  beneficiary: PublicKey;
  lamportsAmount: BigNumber;
  createdEpoch: BigNumber;
};

export const ticketStruct = new BeetStruct<Ticket>(
  [
    ['padding', blob(8)],
    ['stateAddress', publicKey],
    ['beneficiary', publicKey],
    ['lamportsAmount', u64],
    ['createdEpoch', u64],
  ],
  (args) => args as Ticket
);

export type ClaimRecord = {
  buffer: Buffer;
  treasuryAccount: PublicKey;
  authority: PublicKey;
  totalAmount: BigNumber;
  nonClaimedAmount: BigNumber;
};

export const claimRecordStruct = new BeetStruct<ClaimRecord>(
  [
    ['buffer', blob(8)],
    ['treasuryAccount', publicKey],
    ['authority', publicKey],
    ['totalAmount', u64],
    ['nonClaimedAmount', u64],
  ],
  (args) => args as ClaimRecord
);
