import {
  BeetStruct,
  bool,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, i64, i80f48, u128, u64 } from '../../../utils/solana';

export type AccountFlag = {
  initialized: boolean;
  market: boolean;
  openOrders: boolean;
  requestQueue: boolean;
  eventQueue: boolean;
  bids: boolean;
  asks: boolean;
};
export const accountFlagStruct = new BeetStruct<AccountFlag>(
  [
    ['initialized', bool],
    ['market', bool],
    ['openOrders', bool],
    ['requestQueue', bool],
    ['eventQueue', bool],
    ['bids', bool],
    ['asks', bool],
  ],
  (args) => args as AccountFlag
);

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

export type SerumMarketV1 = {
  buffer: Buffer;
  bump: Buffer;
  accountFlags: number;
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
  buffer2: Buffer;
};

export const serumMarketV1Struct = new BeetStruct<SerumMarketV1>(
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
    ['buffer2', blob(7)],
  ],
  (args) => args as SerumMarketV1
);

export type SerumMarketV2 = {
  buffer: Buffer;
  bump: Buffer;
  accountFlags: number;
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
  buffer1: Buffer;
  accountFlags: number;
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
  // authority: PublicKey;
  // pruneAuthority: PublicKey;
  // consumeEventsAuthority: PublicKey;
  // buffer2: Buffer;
  buffer3: Buffer;
};

export const serumMarketV3Struct = new BeetStruct<SerumMarketV3>(
  [
    ['buffer', blob(8)],
    ['buffer1', blob(4)],
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
    // ['authority', publicKey],
    // ['pruneAuthority', publicKey],
    // ['consumeEventsAuthority', publicKey],
    // ['buffer2', blob(992)],
    ['buffer3', blob(7)],
  ],
  (args) => args as SerumMarketV3
);

export type OpenbookMarketV1 = {
  bump: number;
  base_decimals: number;
  quote_decimals: number;
  padding1: number[];
  market_authority: PublicKey;
  time_expiry: BigNumber;
  collect_fee_admin: PublicKey;
  open_orders_admin: NonZeroPubkeyOption;
  consume_events_admin: NonZeroPubkeyOption;
  close_market_admin: NonZeroPubkeyOption;
  name: number[];
  bids: PublicKey;
  asks: PublicKey;
  event_queue: PublicKey;
  oracle_a: NonZeroPubkeyOption;
  oracle_b: NonZeroPubkeyOption;
  oracle_config: OracleConfig;
  quote_lot_size: BigNumber;
  base_lot_size: BigNumber;
  seq_num: BigNumber;
  registration_time: BigNumber;
  maker_fee: BigNumber;
  taker_fee: BigNumber;
  fees_accrued: BigNumber;
  fees_to_referrers: BigNumber;
  referrer_rebates_accrued: BigNumber;
  fees_available: BigNumber;
  maker_volume: BigNumber;
  taker_volume_wo_oo: BigNumber;
  base_mint: PublicKey;
  quote_mint: PublicKey;
  market_base_vault: PublicKey;
  base_deposit_total: BigNumber;
  market_quote_vault: PublicKey;
  quote_deposit_total: BigNumber;
  reserved: number[];
};

export const openbookMarketV1Struct = new BeetStruct<OpenbookMarketV1>(
  [
    ['bump', u8],
    ['base_decimals', u8],
    ['quote_decimals', u8],
    ['padding1', uniformFixedSizeArray(u8, 5)],
    ['market_authority', publicKey],
    ['time_expiry', i64],
    ['collect_fee_admin', publicKey],
    ['open_orders_admin', nonZeroPubkeyOptionStruct],
    ['consume_events_admin', nonZeroPubkeyOptionStruct],
    ['close_market_admin', nonZeroPubkeyOptionStruct],
    ['name', uniformFixedSizeArray(u8, 16)],
    ['bids', publicKey],
    ['asks', publicKey],
    ['event_queue', publicKey],
    ['oracle_a', nonZeroPubkeyOptionStruct],
    ['oracle_b', nonZeroPubkeyOptionStruct],
    ['oracle_config', oracleConfigStruct],
    ['quote_lot_size', i64],
    ['base_lot_size', i64],
    ['seq_num', u64],
    ['registration_time', u64],
    ['maker_fee', i64],
    ['taker_fee', i64],
    ['fees_accrued', u64],
    ['fees_to_referrers', u64],
    ['referrer_rebates_accrued', u64],
    ['fees_available', u64],
    ['maker_volume', u64],
    ['taker_volume_wo_oo', u64],
    ['base_mint', publicKey],
    ['quote_mint', publicKey],
    ['market_base_vault', publicKey],
    ['base_deposit_total', u64],
    ['market_quote_vault', publicKey],
    ['quote_deposit_total', u64],
    ['reserved', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as OpenbookMarketV1
);

export type OpenOrdersV1 = {
  buffer: Buffer;

  accountFlags: AccountFlag;

  market: PublicKey;
  owner: PublicKey;

  baseTokenFree: BigNumber;
  baseTokenTotal: BigNumber;
  quoteTokenFree: BigNumber;
  quoteTokenTotal: BigNumber;

  freeSlotBits: BigNumber;
  isBidBits: BigNumber;

  orders: BigNumber[];
  clientIds: BigNumber[];

  buffer2: Buffer;
};
export const openOrdersV1Struct = new BeetStruct<OpenOrdersV1>(
  [
    ['buffer', blob(5)],

    ['accountFlags', accountFlagStruct],

    ['market', publicKey],
    ['owner', publicKey],

    ['baseTokenFree', u64],
    ['baseTokenTotal', u64],
    ['quoteTokenFree', u64],
    ['quoteTokenTotal', u64],

    ['freeSlotBits', u128],
    ['isBidBits', u128],

    ['orders', uniformFixedSizeArray(u128, 128)],
    ['clientIds', uniformFixedSizeArray(u64, 128)],

    ['buffer2', blob(7)],
  ],
  (args) => args as OpenOrdersV1
);

export type OpenOrdersV2 = {
  buffer: Buffer;

  accountFlags: AccountFlag;

  market: PublicKey;
  owner: PublicKey;

  baseTokenFree: BigNumber;
  baseTokenTotal: BigNumber;
  quoteTokenFree: BigNumber;
  quoteTokenTotal: BigNumber;

  freeSlotBits: BigNumber;
  isBidBits: BigNumber;

  orders: BigNumber[];
  clientIds: BigNumber[];
  referrerRebatesAccrued: BigNumber;
  buffer2: Buffer;
};
export const openOrdersV2Struct = new BeetStruct<OpenOrdersV2>(
  [
    ['buffer', blob(6)],

    ['accountFlags', accountFlagStruct],

    ['market', publicKey],
    ['owner', publicKey],

    ['baseTokenFree', u64],
    ['baseTokenTotal', u64],
    ['quoteTokenFree', u64],
    ['quoteTokenTotal', u64],

    ['freeSlotBits', u128],
    ['isBidBits', u128],

    ['orders', uniformFixedSizeArray(u128, 128)],
    ['clientIds', uniformFixedSizeArray(u64, 128)],

    ['referrerRebatesAccrued', u64],

    ['buffer2', blob(7)],
  ],
  (args) => args as OpenOrdersV2
);

export type Position = {
  /// Base lots in open bids
  bids_base_lots: BigNumber;
  /// Base lots in open asks
  asks_base_lots: BigNumber;

  base_free_native: BigNumber;
  quote_free_native: BigNumber;

  locked_maker_fees: BigNumber;
  referrer_rebates_available: BigNumber;

  /// Cumulative maker volume in quote native units (display only)
  maker_volume: BigNumber;
  /// Cumulative taker volume in quote native units (display only)
  taker_volume: BigNumber;

  reserved: number[];
};
export const positionStruct = new BeetStruct<Position>(
  [
    ['bids_base_lots', i64],
    ['asks_base_lots', i64],
    ['base_free_native', u64],
    ['quote_free_native', u64],
    ['locked_maker_fees', u64],
    ['referrer_rebates_available', u64],
    ['maker_volume', u64],
    ['taker_volume', u64],
    ['reserved', uniformFixedSizeArray(u8, 88)],
  ],
  (args) => args as Position
);
export type OpenOrder = {
  id: BigNumber;
  client_id: BigNumber;
  locked_price: BigNumber;
  is_free: number;
  side_and_tree: number;
  padding: number[];
};
export const openOrderStruct = new BeetStruct<OpenOrder>(
  [
    ['id', u128],
    ['client_id', u64],
    ['locked_price', i64],
    ['is_free', u8],
    ['side_and_tree', u8],
    ['padding', uniformFixedSizeArray(u8, 6)],
  ],
  (args) => args as OpenOrder
);
export type OpenOrdersV3 = {
  owner: PublicKey;
  market: PublicKey;
  name: number[];
  delegate: NonZeroPubkeyOption;
  account_num: number;
  bump: number;
  padding: number[];
  position: Position;
  open_orders: OpenOrder[];
};

export const openOrdersV3Struct = new BeetStruct<OpenOrdersV3>(
  [
    ['owner', publicKey],
    ['market', publicKey],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['delegate', nonZeroPubkeyOptionStruct],
    ['account_num', u32],
    ['bump', u8],
    ['padding', uniformFixedSizeArray(u8, 3)],
    ['position', positionStruct],
    ['open_orders', uniformFixedSizeArray(openOrderStruct, 128)],
  ],
  (args) => args as OpenOrdersV3
);

export type CLOBMarketAccount =
  // | OpenbookMarketV1
  SerumMarketV1 | SerumMarketV2 | SerumMarketV3;
export type CLOBOrderStruct = OpenOrdersV1 | OpenOrdersV2;
