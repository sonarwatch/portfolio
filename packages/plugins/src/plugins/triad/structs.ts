import {
  BeetStruct,
  bool,
  i8,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type StakeV2 = {
  buffer: Buffer;
  bump: number;
  authority: PublicKey;
  init_ts: BigNumber;
  withdraw_ts: BigNumber;
  claimed_ts: BigNumber;
  name: number[];
  mint: PublicKey;
  boost: boolean;
  stake_vault: PublicKey;
  claimCount: BigNumber;
  claimed: BigNumber;
  available: BigNumber;
  amount: BigNumber;
};

export const stakeV2Struct = new BeetStruct<StakeV2>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['authority', publicKey],
    ['init_ts', i64],
    ['withdraw_ts', i64],
    ['claimed_ts', i64],
    ['name', uniformFixedSizeArray(u8, 12)],
    ['mint', publicKey],
    ['boost', bool],
    ['stake_vault', publicKey],
    ['claimCount', u64],
    ['claimed', u64],
    ['available', u64],
    ['amount', u64],
  ],
  (args) => args as StakeV2
);

export enum OrderStatus {
  Init,
  Open,
  Closed,
}

export enum OrderDirection {
  Hype,
  Flop,
}

export enum OrderType {
  Market,
  Limit,
}

export type Order = {
  ts: BigNumber;
  order_id: BigNumber;
  question_id: BigNumber;
  market_id: BigNumber;
  status: OrderStatus;
  price: BigNumber;
  total_amount: BigNumber;
  total_shares: BigNumber;
  type: OrderType;
  direction: OrderDirection;
  user_nonce: BigNumber;
  padding: number[];
};

export const orderStruct = new BeetStruct<Order>(
  [
    ['ts', i64],
    ['order_id', u64],
    ['question_id', u64],
    ['market_id', u64],
    ['status', i8],
    ['price', u64],
    ['total_amount', u64],
    ['total_shares', u64],
    ['type', u8],
    ['direction', u8],
    ['user_nonce', u32],
    ['padding', uniformFixedSizeArray(u8, 28)],
  ],
  (args) => args as Order
);

export type UserTrade = {
  buffer: Buffer;
  bump: number;
  authority: PublicKey;
  total_deposits: BigNumber;
  total_withdraws: BigNumber;
  opened_orders: BigNumber;
  orders: Order[];
};

export const userTradeV2Struct = new BeetStruct<UserTrade>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['authority', publicKey],
    ['total_deposits', u64],
    ['total_withdraws', u64],
    ['opened_orders', u64],
    ['orders', uniformFixedSizeArray(orderStruct, 10)],
  ],
  (args) => args as UserTrade
);

export enum WinningDirection {
  None,
  Hype,
  Flop,
  Draw,
}

export type MarketV2 = {
  buffer: Buffer;
  bump: number;
  authority: PublicKey;
  market_id: BigNumber;
  hype_price: BigNumber;
  flop_price: BigNumber;
  hype_liquidity: BigNumber;
  flop_liquidity: BigNumber;
  hype_shares: BigNumber;
  flop_shares: BigNumber;
  volume: BigNumber;
  mint: PublicKey;
  update_ts: BigNumber;
  opened_orders: BigNumber;
  next_order_id: BigNumber;
  fee_bps: BigNumber;
  nft_holders_fee_available: BigNumber;
  nft_holders_fee_claimed: BigNumber;
  market_fee_available: BigNumber;
  market_fee_claimed: BigNumber;
  is_allowed_to_payout: boolean;
  market_start: boolean;
  market_end: boolean;
  question: number[];
  winning_direction: WinningDirection;
  market_liquidity_at_start: BigNumber[];
};

export const marketV2Struct = new BeetStruct<MarketV2>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['authority', publicKey],
    ['market_id', u64],
    ['hype_price', u64],
    ['flop_price', u64],
    ['hype_liquidity', u64],
    ['flop_liquidity', u64],
    ['hype_shares', u64],
    ['flop_shares', u64],
    ['volume', u64],
    ['mint', publicKey],
    ['update_ts', i64],
    ['opened_orders', u64],
    ['next_order_id', u64],
    ['fee_bps', u16],
    ['nft_holders_fee_available', u64],
    ['nft_holders_fee_claimed', u64],
    ['market_fee_available', u64],
    ['market_fee_claimed', u64],
    ['is_allowed_to_payout', bool],
    ['market_start', i64],
    ['market_end', i64],
    ['question', uniformFixedSizeArray(u8, 80)],
    ['winning_direction', u8],
    ['market_liquidity_at_start', u64],
  ],
  (args) => args as MarketV2
);
