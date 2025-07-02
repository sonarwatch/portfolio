import {
  BeetStruct,
  bool,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u64 } from '../../utils/solana';

// Underlying CommitBin struct
export type CommitBin = {
  commitQuoteTokenAmount: BigNumber;
  claimedQuoteTokenAmount: BigNumber;
};

export const commitBinStruct = new BeetStruct<CommitBin>(
  [
    ['commitQuoteTokenAmount', u64],
    ['claimedQuoteTokenAmount', u64],
  ],
  (args) => args as CommitBin
);

// CommitStatus struct
export type CommitStatus = {
  discriminator: number[];
  initialized: boolean;
  auction: PublicKey;
  user: PublicKey;
  bins: CommitBin[];
};

export const commitStatusStruct = new BeetStruct<CommitStatus>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['initialized', bool], // bool as u8
    ['auction', publicKey],
    ['user', publicKey],
    ['bins', uniformFixedSizeArray(commitBinStruct, 20)],
  ],
  (args) => args as CommitStatus
);

// Underlying AuctionBin struct
export type AuctionBin = {
  unitPrice: BigNumber;
  totalSupply: BigNumber;
  totalCommitted: BigNumber;
  claimedListTokenAmount: BigNumber;
  claimedQuoteTokenAmount: BigNumber;
};

export const auctionBinStruct = new BeetStruct<AuctionBin>(
  [
    ['unitPrice', u64],
    ['totalSupply', u64],
    ['totalCommitted', u64],
    ['claimedListTokenAmount', u64],
    ['claimedQuoteTokenAmount', u64],
  ],
  (args) => args as AuctionBin
);

// This is an experiment, no real enum listed on IDLs
export enum AuctionStatus {
  Open = 0,
  Closed = 1,
}

// Auction struct
export type Auction = {
  discriminator: number[];
  auctionId: PublicKey;
  listMint: PublicKey;
  quoteMint: PublicKey;
  vault: PublicKey;
  vaultBump: number[];
  commitStartTime: BigNumber;
  commitEndTime: BigNumber;
  claimStartTime: BigNumber;
  binCount: number;
  bins: AuctionBin[];
  status: AuctionStatus;
  totalParticipants: BigNumber;
  finishClaimParticipants: BigNumber;
  totalFeesCollected: BigNumber;
  custodyAuthority: PublicKey;
  whitelistAuthority: PublicKey;
  userCommitCapLimit: BigNumber;
  claimFeeBasis: BigNumber;
  hasWithdrawFunds: boolean;
};

export const auctionStruct = new BeetStruct<Auction>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['auctionId', publicKey],
    ['listMint', publicKey],
    ['quoteMint', publicKey],
    ['vault', publicKey],
    ['vaultBump', uniformFixedSizeArray(u8, 1)],
    ['commitStartTime', u64],
    ['commitEndTime', u64],
    ['claimStartTime', u64],
    ['binCount', u8],
    ['bins', uniformFixedSizeArray(auctionBinStruct, 20)],
    ['status', u8],
    ['totalParticipants', u64],
    ['finishClaimParticipants', u64],
    ['totalFeesCollected', u64],
    ['custodyAuthority', publicKey],
    ['whitelistAuthority', publicKey],
    ['userCommitCapLimit', u64],
    ['claimFeeBasis', u64],
    ['hasWithdrawFunds', u8], // bool as u8
  ],
  (args) =>
    ({
      ...args,
      hasWithdrawFunds: Boolean(args.hasWithdrawFunds),
    } as Auction)
);
