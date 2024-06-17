import { BeetStruct, bool, u16, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { blob, i64, u64 } from '../../utils/solana';

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
  buffer: Buffer;
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
    ['buffer', blob(8)],
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

export enum TokenCategory {
  Point,
  PreMarket,
}

export enum TokenStatus {
  Active,
  Settle,
  Inactive,
}

export type TokenConfig = {
  buffer: Buffer;
  version: number;
  id: number;
  bump: number;
  settleTime: BigNumber;
  settleDuration: BigNumber;
  pledgeRate: BigNumber;
  status: TokenStatus;
  token: PublicKey;
  config: PublicKey;
  vaultToken: PublicKey;
  vaultTokenBump: number;
  settleRate: BigNumber;
  category: TokenCategory;
  feeRefund: BigNumber;
  feeSettle: BigNumber;
};

export const tokenConfigStruct = new BeetStruct<TokenConfig>(
  [
    ['buffer', blob(8)],
    ['version', u8],
    ['id', u16],
    ['bump', u8],
    ['settleTime', i64],
    ['settleDuration', i64],
    ['pledgeRate', u64],
    ['status', u8],
    ['token', publicKey],
    ['config', publicKey],
    ['vaultToken', publicKey],
    ['vaultTokenBump', u8],
    ['settleRate', u64],
    ['category', u8],
    ['feeRefund', u64],
    ['feeSettle', u64],
  ],
  (args) => args as TokenConfig
);
