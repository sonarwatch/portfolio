import { BeetStruct, bool, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { blob, u64 } from '../../utils/solana';

export enum OfferStatus {
  Open,
  Closed,
}

export enum OfferType {
  Buy,
  Sell,
}

export enum OrderStatus {
  Open,
  Closed,
  Cancelled,
}

export type Offer = {
  buffer: Buffer;
  version: number;
  id: BigNumber;
  offerType: OfferType;
  tokenConfig: PublicKey;
  totalAmount: BigNumber;
  price: BigNumber;
  exToken: PublicKey;
  collateral: BigNumber;
  status: OfferStatus;
  filledAmount: BigNumber;
  isFullMatch: boolean;
  authority: PublicKey;
  bump: number;
  config: PublicKey;
};

export const offerStruct = new BeetStruct<Offer>(
  [
    ['buffer', blob(8)],
    ['version', u8],
    ['id', u64],
    ['offerType', u8],
    ['tokenConfig', publicKey],
    ['totalAmount', u64],
    ['price', u64],
    ['exToken', publicKey],
    ['collateral', u64],
    ['status', u8],
    ['filledAmount', u64],
    ['isFullMatch', bool],
    ['authority', publicKey],
    ['bump', u8],
    ['config', publicKey],
  ],
  (args) => args as Offer
);

export type Order = {
  version: number;
  id: BigNumber;
  config: PublicKey;
  offer: PublicKey;
  authority: PublicKey;
  bump: number;
  seller: PublicKey;
  buyer: PublicKey;
  status: OrderStatus;
  amount: BigNumber;
};

export const orderStruct = new BeetStruct<Order>(
  [
    ['version', u8],
    ['id', u64],
    ['config', publicKey],
    ['offer', publicKey],
    ['authority', publicKey],
    ['bump', u8],
    ['seller', publicKey],
    ['buyer', publicKey],
    ['status', u8],
    ['amount', u64],
  ],
  (args) => args as Order
);

export type ExToken = {
  version: number;
  bump: number;
  isAccepted: boolean;
  token: PublicKey;
  config: PublicKey;
  vaultToken: PublicKey;
  vaultTokenBump: number;
};

export const exTokenStruct = new BeetStruct<ExToken>(
  [
    ['version', u8],
    ['bump', u8],
    ['isAccepted', bool],
    ['token', publicKey],
    ['config', publicKey],
    ['vaultToken', publicKey],
    ['vaultTokenBump', u8],
  ],
  (args) => args as ExToken
);
