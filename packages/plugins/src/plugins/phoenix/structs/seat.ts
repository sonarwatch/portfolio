import { BeetStruct, uniformFixedSizeArray } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { u64 } from '../../../utils/solana';

export type Seat = {
  discriminant: BigNumber;
  market: PublicKey;
  trader: PublicKey;
  approvalStatus: BigNumber;
  padding: BigNumber[] /* size: 6 */;
};

export const seatStruct = new BeetStruct<Seat>(
  [
    ['discriminant', u64],
    ['market', publicKey],
    ['trader', publicKey],
    ['approvalStatus', u64],
    ['padding', uniformFixedSizeArray(u64, 6)],
  ],
  (args) => args as Seat
);
