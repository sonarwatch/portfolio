import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, i64, i80f48, u64 } from '../../../utils/solana';

export enum AccountFlags {
  Ehee,
  eje,
}

export type SerumMarketV2 = {
  buffer: Buffer;
  bump: Buffer;
  accountFlags: AccountFlags;
  ownAddress: PublicKey;
  vaultSignerNonce: BigNumber;
  baseMint: PublicKey;
  quoteMint: PublicKey;
  baseVault: PublicKey;
  baseDepositsTotal: BigNumber;
  baseFeesAccrued: BigNumber;
  quoteVault: PublicKey;
  quoteDepositsTotal: BigNumber;
  quoteFeesAccrued: BigNumber;
  quoteDustThreshold: BigNumber;
  requestQueue: PublicKey;
  eventQueue: PublicKey;
  bids: PublicKey;
  asks: PublicKey;
  baseLotSize: BigNumber;
  quoteLotSize: BigNumber;
  feeRateBps: BigNumber;
  referrerRebatesAccrued: BigNumber;
  buffer2: Buffer;
};

export const serumMarketV2Struct = new BeetStruct<SerumMarketV2>(
  [
    ['buffer', blob(8)],
    ['bump', blob(4)],
    ['accountFlags', u8],
    ['ownAddress', publicKey],
    ['vaultSignerNonce', u64],
    ['baseMint', publicKey],
    ['quoteMint', publicKey],
    ['baseVault', publicKey],
    ['baseDepositsTotal', u64],
    ['baseFeesAccrued', u64],
    ['quoteVault', publicKey],
    ['quoteDepositsTotal', u64],
    ['quoteFeesAccrued', u64],
    ['quoteDustThreshold', u64],
    ['requestQueue', publicKey],
    ['eventQueue', publicKey],
    ['bids', publicKey],
    ['asks', publicKey],
    ['baseLotSize', u64],
    ['quoteLotSize', u64],
    ['feeRateBps', u64],
    ['referrerRebatesAccrued', u64],
    ['buffer2', blob(7)],
  ],
  (args) => args as SerumMarketV2
);

export type SerumMarketV3 = {
  buffer: Buffer;
  accountFlags: AccountFlags;
  ownAddress: PublicKey;
  vaultSignerNonce: BigNumber;
  baseMint: PublicKey;
  quoteMint: PublicKey;
  baseVault: PublicKey;
  baseDepositsTotal: BigNumber;
  baseFeesAccrued: BigNumber;
  quoteVault: PublicKey;
  quoteDepositsTotal: BigNumber;
  quoteFeesAccrued: BigNumber;
  quoteDustThreshold: BigNumber;
  requestQueue: PublicKey;
  eventQueue: PublicKey;
  bids: PublicKey;
  asks: PublicKey;
  baseLotSize: BigNumber;
  quoteLotSize: BigNumber;
  feeRateBps: BigNumber;
  referrerRebatesAccrued: BigNumber;
  authority: PublicKey;
  pruneAuthority: PublicKey;
  consumeEventsAuthority: PublicKey;
  buffer1: Buffer;
  buffer2: Buffer;
};

export const serumMarketV3Struct = new BeetStruct<SerumMarketV3>(
  [
    ['buffer', blob(5)],
    ['accountFlags', u8],
    ['ownAddress', publicKey],
    ['vaultSignerNonce', u64],
    ['baseMint', publicKey],
    ['quoteMint', publicKey],
    ['baseVault', publicKey],
    ['baseDepositsTotal', u64],
    ['baseFeesAccrued', u64],
    ['quoteVault', publicKey],
    ['quoteDepositsTotal', u64],
    ['quoteFeesAccrued', u64],
    ['quoteDustThreshold', u64],
    ['requestQueue', publicKey],
    ['eventQueue', publicKey],
    ['bids', publicKey],
    ['asks', publicKey],
    ['baseLotSize', u64],
    ['quoteLotSize', u64],
    ['feeRateBps', u64],
    ['referrerRebatesAccrued', u64],
    ['authority', publicKey],
    ['pruneAuthority', publicKey],
    ['consumeEventsAuthority', publicKey],
    ['buffer1', blob(992)],
    ['buffer2', blob(7)],
  ],
  (args) => args as SerumMarketV3
);

// export type SerumOpenOrder = {
//   market: PublicKey;
//   openOrders: PublicKey;
//   requestQueue: PublicKey;
//   eventQueue: PublicKey;
//   bids: PublicKey;
//   asks: PublicKey;
//   payer: PublicKey;
//   owner: PublicKey;
//   coinVault: PublicKey;
//   pcVault: PublicKey;
//   side: number;
//   limitPrice: BigNumber;
//   maxBaseQuantity: number;
//   maxbaseQuantity: number;
//   selfTradeBehavior: u8;
//   orderType: u8;
//   clientId: number;
//   limit: BigNumber;
// };

export type OracleConfig = {
  confFilter: BigNumber;
  maxStalenessSlots: BigNumber;
  reserved: number[];
};

export const oracleConfigStruct = new BeetStruct<OracleConfig>(
  [
    ['confFilter', i80f48],
    ['maxStalenessSlots', i64],
    ['reserved', uniformFixedSizeArray(u8, 72)],
  ],
  (args) => args as OracleConfig
);

export type NonZeroPubkeyOption = {
  key: PublicKey;
};

export const nonZeroPubkeyOptionStruct = new BeetStruct<NonZeroPubkeyOption>(
  [['key', publicKey]],
  (args) => args as NonZeroPubkeyOption
);

export type Market = {
  buffer: Buffer;
  bump: number;
  baseDecimals: number;
  quoteDecimals: number;
  padding1: number[];
  marketAuthority: PublicKey;
  timeExpiry: BigNumber;
  collectFeeAdmin: PublicKey;
  openOrdersAdmin: NonZeroPubkeyOption;
  consumeEventsAdmin: NonZeroPubkeyOption;
  closeMarketAdmin: NonZeroPubkeyOption;
  name: number[];
  bids: PublicKey;
  asks: PublicKey;
  eventQueue: PublicKey;
  oracleA: NonZeroPubkeyOption;
  oracleB: NonZeroPubkeyOption;
  oracleConfig: OracleConfig;
  quoteLotSize: BigNumber;
  baseLotSize: BigNumber;
  seqNum: BigNumber;
  registrationTime: BigNumber;
  makerFee: BigNumber;
  takerFee: BigNumber;
  feesAccrued: BigNumber;
  feesToReferrers: BigNumber;
  referrerRebatesAccrued: BigNumber;
  feesAvailable: BigNumber;
  makerVolume: BigNumber;
  takerVolumeWoOo: BigNumber;
  baseMint: PublicKey;
  quoteMint: PublicKey;
  marketBaseVault: PublicKey;
  baseDepositTotal: BigNumber;
  marketQuoteVault: PublicKey;
  quoteDepositTotal: BigNumber;
  reserved: number[];
};

export const marketStruct = new BeetStruct<Market>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['baseDecimals', u8],
    ['quoteDecimals', u8],
    ['padding1', uniformFixedSizeArray(u8, 5)],
    ['marketAuthority', publicKey],
    ['timeExpiry', i64],
    ['collectFeeAdmin', publicKey],
    ['openOrdersAdmin', nonZeroPubkeyOptionStruct],
    ['consumeEventsAdmin', nonZeroPubkeyOptionStruct],
    ['closeMarketAdmin', nonZeroPubkeyOptionStruct],
    ['name', uniformFixedSizeArray(u8, 16)],
    ['bids', publicKey],
    ['asks', publicKey],
    ['eventQueue', publicKey],
    ['oracleA', nonZeroPubkeyOptionStruct],
    ['oracleB', nonZeroPubkeyOptionStruct],
    ['oracleConfig', oracleConfigStruct],
    ['quoteLotSize', i64],
    ['baseLotSize', i64],
    ['seqNum', u64],
    ['registrationTime', u64],
    ['makerFee', i64],
    ['takerFee', i64],
    ['feesAccrued', u64],
    ['feesToReferrers', u64],
    ['referrerRebatesAccrued', u64],
    ['feesAvailable', u64],
    ['makerVolume', u64],
    ['takerVolumeWoOo', u64],
    ['baseMint', publicKey],
    ['quoteMint', publicKey],
    ['marketBaseVault', publicKey],
    ['baseDepositTotal', u64],
    ['marketQuoteVault', publicKey],
    ['quoteDepositTotal', u64],
    ['reserved', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as Market
);
