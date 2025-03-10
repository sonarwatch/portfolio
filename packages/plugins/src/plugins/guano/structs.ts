import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type Stake = {
  buffer: Buffer;
  amount: BigNumber;
  owner: PublicKey;
  createdAt: BigNumber;
  lastStakedAt: BigNumber;
  lastClaimedAt: BigNumber;
  lastClaimedAmount: BigNumber;
  claimedAmount: BigNumber;
  tierType: number;
  bump: number;
  padding: Buffer;
};

export const stakeStruct = new BeetStruct<Stake>(
  [
    ['buffer', blob(8)],
    ['amount', u64],
    ['owner', publicKey],
    ['createdAt', u64],
    ['lastStakedAt', u64],
    ['lastClaimedAt', u64],
    ['lastClaimedAmount', u64],
    ['claimedAmount', u64],
    ['tierType', u8],
    ['bump', u8],
    ['padding', blob(6)],
  ],
  (args) => args as Stake
);

export type Unstake = {
  buffer: Buffer;
  amount: BigNumber;
  owner: PublicKey;
  createdAt: BigNumber;
  lastStakedAt: BigNumber;
  lastClaimedAt: BigNumber;
  lastClaimedAmount: BigNumber;
  claimedAmount: BigNumber;
  tierType: number;
  bump: number;
  padding: Buffer;
};

export const unstakeStruct = new BeetStruct<Unstake>(
  [
    ['buffer', blob(8)],
    ['amount', u64],
    ['owner', publicKey],
    ['createdAt', u64],
    ['lastStakedAt', u64],
    ['lastClaimedAt', u64],
    ['lastClaimedAmount', u64],
    ['claimedAmount', u64],
    ['tierType', u8],
    ['bump', u8],
    ['padding', blob(6)],
  ],
  (args) => args as Unstake
);
