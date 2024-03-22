import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type Liquidity = {
  buffer: Buffer;
  poolRegistry: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amountDeposited: BigNumber;
  lastObservedTap: BigNumber;
  lastClaimed: BigNumber;
  totalEarned: BigNumber;
  createdAt: BigNumber;
  space: number[];
};

export const liquidityStruct = new BeetStruct<Liquidity>(
  [
    ['buffer', blob(8)],
    ['poolRegistry', publicKey],
    ['mint', publicKey],
    ['owner', publicKey],
    ['amountDeposited', u64],
    ['lastObservedTap', u64],
    ['lastClaimed', i64],
    ['totalEarned', u64],
    ['createdAt', i64],
    ['space', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as Liquidity
);

export type UnstakingTicket = {
  totalUnstaked: BigNumber;
  createdAt: BigNumber;
};

export const unstakingTicketStruct = new BeetStruct<UnstakingTicket>(
  [
    ['totalUnstaked', u64],
    ['createdAt', i64],
  ],
  (args) => args as UnstakingTicket
);

export type UserMetadata = {
  buffer: Buffer;
  owner: PublicKey;
  accountOpenedAt: BigNumber;
  totalStaked: BigNumber;
  lastObservedTap: BigNumber;
  lastClaimed: BigNumber;
  totalEarned: BigNumber;
  unstakingTickets: UnstakingTicket[];
};

export const userMetadataStruct = new BeetStruct<UserMetadata>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['accountOpenedAt', i64],
    ['totalStaked', u64],
    ['lastObservedTap', u64],
    ['lastClaimed', i64],
    ['totalEarned', u64],
    ['unstakingTickets', uniformFixedSizeArray(unstakingTicketStruct, 64)],
  ],
  (args) => args as UserMetadata
);
