import { BeetStruct, u16, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

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
  ],
  (args) => args as Escrow
);

export type Staking = {
  buffer: Buffer;
  owner: PublicKey;
  registeredStake: PublicKey;
  stakeMint: PublicKey;
  totalStake: BigNumber;
  activeStake: BigNumber;
  pendingRewards: BigNumber;
  paidRewards: BigNumber;
  currentPeriod: number;
  stakedAtTs: BigNumber;
  lastPendingRewardCalcTs: BigNumber;
  lastHarvestTs: BigNumber;
  unstakedTs: BigNumber;
  bump: number;
};

export const stakingStruct = new BeetStruct<Staking>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['registeredStake', publicKey],
    ['stakeMint', publicKey],
    ['totalStake', u64],
    ['activeStake', u64],
    ['pendingRewards', u64],
    ['paidRewards', u64],
    ['currentPeriod', u16],
    ['stakedAtTs', i64],
    ['lastPendingRewardCalcTs', i64],
    ['lastHarvestTs', i64],
    ['unstakedTs', i64],
    ['bump', u8],
  ],
  (args) => args as Staking
);
