import { BeetStruct } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export enum State {
  Uninitialized,
  StakePool,
  InactiveStakePool,
  StakeAccount,
}

export type Offer = {
  buffer: Buffer;
  domain: PublicKey;
  owner: PublicKey;
  mint: PublicKey;
  amount: BigNumber;
  tokenAccount: PublicKey;
};

export const offerStruct = new BeetStruct<Offer>(
  [
    ['buffer', blob(2)],
    ['domain', publicKey],
    ['owner', publicKey],
    ['mint', publicKey],
    ['amount', u64],
    ['tokenAccount', publicKey],
  ],
  (args) => args as Offer
);

export type CategoryOffer = {
  buffer: Buffer;
  idk: BigNumber;
  amount: BigNumber;
  categoryAccount: PublicKey;
  owner: PublicKey;
};

export const categoryOfferStruct = new BeetStruct<CategoryOffer>(
  [
    ['buffer', blob(2)],
    ['idk', u64],
    ['amount', u64],
    ['categoryAccount', publicKey],
    ['owner', publicKey],
  ],
  (args) => args as CategoryOffer
);
