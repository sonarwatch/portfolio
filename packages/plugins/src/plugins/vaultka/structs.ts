import {
  BeetStruct,
  bool,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type UserInfo = {
  buffer: Buffer;
  shares: BigNumber;
};

export const userInfoStruct = new BeetStruct<UserInfo>(
  [
    ['buffer', blob(8)],
    ['shares', u128],
  ],
  (args) => args as UserInfo
);

export type Lending = {
  buffer: Buffer;
  vault_balance: BigNumber;
  borrowed_amount: BigNumber;
  owner: PublicKey;
  total_shares: BigNumber;
  max_utilization_rate: BigNumber;
  water_fee_receiver: PublicKey;
  withdraw_fee: BigNumber;
  withdraw_fee_receiver_ata: PublicKey;
  mint: PublicKey;
};

export const lendingStruct = new BeetStruct<Lending>(
  [
    ['buffer', blob(8)],
    ['vault_balance', u128],
    ['borrowed_amount', u128],
    ['owner', publicKey],
    ['total_shares', u128],
    ['max_utilization_rate', u64],
    ['water_fee_receiver', publicKey],
    ['withdraw_fee', u64],
    ['withdraw_fee_receiver_ata', publicKey],
    ['mint', publicKey],
  ],
  (args) => args as Lending
);

export type PositionInfo = {
  buffer: Buffer;
  amount: BigNumber;
  pos_id: BigNumber;
  user: PublicKey;
  leverageNum: number;
  closed: boolean;
  liquidated: boolean;
  leverage_amount: BigNumber;
  is_in_deposit_request: boolean;
  is_in_withdraw_request: boolean;
  position_amount: BigNumber;
  to_be_liquidated: boolean;
  open_timestamp: BigNumber;
  close_timestamp: BigNumber;
  expected_amount_out_token: BigNumber;
  expected_amount_out_collateral: BigNumber;
  increase_position_collateral_pendings: BigNumber;
  requests_slippage: number;
};

export const positionInfoStruct = new BeetStruct<PositionInfo>(
  [
    ['buffer', blob(8)],
    ['amount', u64],
    ['pos_id', u64],
    ['user', publicKey],
    ['leverageNum', u8],
    ['closed', bool],
    ['liquidated', bool],
    ['leverage_amount', u64],
    ['is_in_deposit_request', bool],
    ['is_in_withdraw_request', bool],
    ['position_amount', u64],
    ['to_be_liquidated', bool],
    ['open_timestamp', i64],
    ['close_timestamp', i64],
    ['expected_amount_out_token', u64],
    ['expected_amount_out_collateral', u64],
    ['increase_position_collateral_pendings', u64],
    ['requests_slippage', u8],
  ],
  (args) => args as PositionInfo
);

export type Strategy = {
  buffer: Buffer;
  keeper: PublicKey;
  keeper_ata: PublicKey;
  next_position_id: BigNumber;
  dtv_limit: BigNumber;
  leverage_limit: BigNumber;
  fixed_fee_split: BigNumber;
  mfee_percent: BigNumber;
  usdt_usd_feed: number[];
  jlp_sol_feed: number[];
  collateral_mint: PublicKey;
  keeper_fees: BigNumber;
  borrow_mint: PublicKey;
};

export const strategyStruct = new BeetStruct<Strategy>(
  [
    ['buffer', blob(8)],
    ['keeper', publicKey],
    ['keeper_ata', publicKey],
    ['next_position_id', u64],
    ['dtv_limit', u64],
    ['leverage_limit', u64],
    ['fixed_fee_split', u64],
    ['mfee_percent', u64],
    ['usdt_usd_feed', uniformFixedSizeArray(u8, 32)],
    ['jlp_sol_feed', uniformFixedSizeArray(u8, 32)],
    ['collateral_mint', publicKey],
    ['keeper_fees', u64],
    ['borrow_mint', publicKey],
  ],
  (args) => args as Strategy
);

export type LstPositionInfo = {
  buffer: Buffer;
  amount: BigNumber;
  pos_id: BigNumber;
  user: PublicKey;
  leverage: BigNumber;
  closed: boolean;
  liquidated: boolean;
  leverage_amount: BigNumber;
  is_in_deposit_request: boolean;
  is_in_withdraw_request: boolean;
  position_amount: BigNumber;
  to_be_liquidated: boolean;
  deposit_keeper_fee_paid: BigNumber;
  withdraw_keeper_fee_paid: BigNumber;
  open_timestamp: BigNumber;
  close_timestamp: BigNumber;
  sol_price_open: BigNumber;
  sol_price_close: BigNumber;
  close_received_sol_amount: BigNumber;
  expected_amount_out_lst: BigNumber;
  expected_amount_out_sol: BigNumber;
};

export const lstPositionInfoStruct = new BeetStruct<LstPositionInfo>(
  [
    ['buffer', blob(8)],
    ['amount', u64],
    ['pos_id', u64],
    ['user', publicKey],
    ['leverage', u64],
    ['closed', bool],
    ['liquidated', bool],
    ['leverage_amount', u64],
    ['is_in_deposit_request', bool],
    ['is_in_withdraw_request', bool],
    ['position_amount', u64],
    ['to_be_liquidated', bool],
    ['deposit_keeper_fee_paid', u64],
    ['withdraw_keeper_fee_paid', u64],
    ['open_timestamp', i64],
    ['close_timestamp', i64],
    ['sol_price_open', u128],
    ['sol_price_close', u128],
    ['close_received_sol_amount', u64],
    ['expected_amount_out_lst', u64],
    ['expected_amount_out_sol', u64],
  ],
  (args) => args as LstPositionInfo
);

export type LstStrategy = {
  buffer: Buffer;
  keeper: PublicKey;
  keeper_ata: PublicKey;
  next_position_id: BigNumber;
  dtv_limit: BigNumber;
  leverage_limit: BigNumber;
  fixed_fee_split: BigNumber;
  mfee_percent: BigNumber;
  sol_usd_feed: number[];
  lst_feed: number[];
  collateral_mint: PublicKey;
  keeper_fees: BigNumber;
  lst_price: BigNumber;
  is_manual_price_update: boolean;
  slippage_control: BigNumber;
  lst_price_control_slippage: BigNumber;
  admin: PublicKey;
  maturity_time: BigNumber;
};

export const lstStrategyStruct = new BeetStruct<LstStrategy>(
  [
    ['buffer', blob(8)],
    ['keeper', publicKey],
    ['keeper_ata', publicKey],
    ['next_position_id', u64],
    ['dtv_limit', u64],
    ['leverage_limit', u64],
    ['fixed_fee_split', u64],
    ['mfee_percent', u64],
    ['sol_usd_feed', uniformFixedSizeArray(u8, 32)],
    ['lst_feed', uniformFixedSizeArray(u8, 32)],
    ['collateral_mint', publicKey],
    ['keeper_fees', u64],
    ['lst_price', u64],
    ['is_manual_price_update', bool],
    ['slippage_control', u64],
    ['lst_price_control_slippage', u64],
    ['admin', publicKey],
    ['maturity_time', i64],
  ],
  (args) => args as LstStrategy
);
