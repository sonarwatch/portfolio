import {
  array,
  BeetStruct,
  bool,
  FixableBeetStruct,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { i64, u64 } from '../../utils/solana';

// {
//   "name": "LockupKind",
//   "repr": { "kind": "rust" },
//   "type": {
//     "kind": "enum",
//     "variants": [
//       { "name": "None" },
//       { "name": "Cliff" },
//       { "name": "Constant" }
//     ]
//   }
// },

export enum LockupKind {
  None = 0,
  Cliff = 1,
  Constant = 2,
}

export type Lockup = {
  startTs: BigNumber;
  endTs: BigNumber;
  kind: number;
};
export const lockupStruct = new BeetStruct<Lockup>(
  [
    ['startTs', i64],
    ['endTs', i64],
    ['kind', u8],
  ],
  (args) => args as Lockup,
  'Lockup'
);

export type RecentProposal = {
  proposal: PublicKey;
  ts: BigNumber;
};
export const recentProposalStruct = new BeetStruct<RecentProposal>(
  [
    ['proposal', publicKey],
    ['ts', i64],
  ],
  (args) => args as RecentProposal,
  'RecentProposal'
);

export type PositionData = {
  registrar: PublicKey;
  mint: PublicKey;
  lockup: Lockup;
  amountDepositedNative: BigNumber;
  votingMintConfigIdx: number;
  numActiveVotes: number;
  genesisEnd: BigNumber;
  bumpSeed: number;
  voteController: PublicKey;
  registrarPaidRent: BigNumber;
  recentProposals: RecentProposal[];
};
export const positionDataStruct = new FixableBeetStruct<PositionData>(
  [
    ['registrar', publicKey],
    ['mint', publicKey],
    ['lockup', lockupStruct],
    ['amountDepositedNative', u64],
    ['votingMintConfigIdx', u8],
    ['numActiveVotes', u16],
    ['genesisEnd', i64],
    ['bumpSeed', u8],
    ['voteController', publicKey],
    ['registrarPaidRent', u64],
    ['recentProposals', array(recentProposalStruct)],
  ],
  (args) => args as PositionData,
  'PositionData'
);
