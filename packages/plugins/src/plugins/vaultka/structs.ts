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
  leverage: number;
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
    ['leverage', u8],
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
  token_mint: PublicKey;
  keeper_fees: BigNumber;
  collateral_mint: PublicKey;
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
    ['token_mint', publicKey],
    ['keeper_fees', u64],
    ['collateral_mint', publicKey],
  ],
  (args) => args as Strategy
);
