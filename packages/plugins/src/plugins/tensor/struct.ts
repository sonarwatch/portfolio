import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type SingleListing = {
  padding: Buffer;
  owner: PublicKey;
  nftMint: PublicKey;
  price: BigNumber;
  bump: number[];
  reserved: number[];
};

export const singleListingStruct = new BeetStruct<SingleListing>(
  [
    ['padding', blob(8)],
    ['owner', publicKey],
    ['nftMint', publicKey],
    ['price', u64],
    ['bump', uniformFixedSizeArray(u8, 1)],
    ['reserved', uniformFixedSizeArray(u8, 64)],
  ],
  (args) => args as SingleListing
);
