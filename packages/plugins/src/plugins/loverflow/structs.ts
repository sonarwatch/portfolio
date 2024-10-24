import { BeetStruct, bool } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u64 } from '../../utils/solana';

export type Schedule = {
  releaseTime: BigNumber;
  amount: BigNumber;
};

export const scheduleStruct = new BeetStruct<Schedule>(
  [
    ['releaseTime', u64],
    ['amount', u64],
  ],
  (args) => args as Schedule
);
export type Claim = {
  destinationAddress: PublicKey;
  mintAddress: PublicKey;
  isInitialized: boolean;
  releaseTime: BigNumber;
  amount: BigNumber;
};

export const claimStruct = new BeetStruct<Claim>(
  [
    ['destinationAddress', publicKey],
    ['mintAddress', publicKey],
    ['isInitialized', bool],
    ['releaseTime', u64],
    ['amount', u64],
  ],
  (args) => args as Claim
);
