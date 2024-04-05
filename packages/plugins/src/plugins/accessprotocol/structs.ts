import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u64 } from '../../utils/solana';

export enum Tag {
  Uninitialized = 0,
  StakePool = 1,
  InactiveStakePool = 2,
  StakeAccount = 3,
  // Bond accounts are inactive until the buyer transfered the funds
  InactiveBondAccount = 4,
  BondAccount = 5,
  CentralState = 6,
  Deleted = 7,
  FrozenStakePool = 8,
  FrozenStakeAccount = 9,
  FrozenBondAccount = 10,
}

export type StakeAccount = {
  tag: Tag;
  owner: PublicKey;
  stakeAmount: BigNumber;
  stakePool: PublicKey;
  lastClaimedOffset: BigNumber;
  poolMinimumAtCreation: BigNumber;
};

export const stakeAccountStruct = new BeetStruct<StakeAccount>(
  [
    ['tag', u8],
    ['owner', publicKey],
    ['stakeAmount', u64],
    ['stakePool', publicKey],
    ['lastClaimedOffset', u64],
    ['poolMinimumAtCreation', u64],
  ],
  (args) => args as StakeAccount
);
