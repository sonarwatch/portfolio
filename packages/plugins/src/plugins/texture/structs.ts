import {
  BeetStruct,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u128, u64 } from '../../utils/solana';

export type User = {
  accountDiscriminator: number[];
  version: number;
  bump: number;
  nick: Buffer;
  owner: PublicKey;
};

export const userStruct = new BeetStruct<User>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['bump', u8],
    ['nick', blob(14)],
    ['owner', publicKey],
  ],
  (args) => args as User
);

export enum LoanStatus {
  Unknown,
  Active,
  Repaid,
  Defaulted,
}

export type Loan = {
  accountDiscriminator: number[];
  version: number;
  _padding0: Uint8Array;
  bulk_uuid: Uint8Array;
  client_loan_id: Uint8Array;
  _padding1: Uint8Array;
  pair: PublicKey;
  apr_bps: number;
  principal: BigNumber;
  collateral: BigNumber;
  duration_sec: BigNumber;
  lender: PublicKey;
  start_time: BigNumber;
  end_time: BigNumber;
  borrower: PublicKey;
  status: LoanStatus;
  _padding2: Uint8Array;
};

export const loanStruct = new BeetStruct<Loan>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['_padding0', blob(7)],
    ['bulk_uuid', blob(16)],
    ['client_loan_id', blob(16)],
    ['_padding1', blob(4)],
    ['pair', publicKey],
    ['apr_bps', u32],
    ['principal', u64],
    ['collateral', u64],
    ['duration_sec', u64],
    ['lender', publicKey],
    ['start_time', u64],
    ['end_time', u64],
    ['borrower', publicKey],
    ['status', u8],
    ['_padding2', blob(32 * 4 * 7)],
  ],
  (args) => args as Loan
);

export type Offer = {
  accountDiscriminator: number[];
  version: number;
  _padding0: Uint8Array;
  pair: PublicKey;
  client_offer_id: Uint8Array;
  principal: BigNumber;
  collateral: BigNumber;
  remaining_principal: BigNumber;
  remaining_collateral: BigNumber;
  lender: PublicKey;
  _padding1: Uint8Array;
};

export const offerStruct = new BeetStruct<Offer>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['_padding0', blob(7)],
    ['pair', publicKey],
    ['client_offer_id', blob(16)],
    ['principal', u64],
    ['collateral', u64],
    ['remaining_principal', u64],
    ['remaining_collateral', u64],
    ['lender', publicKey],
    ['_padding1', blob(32 * 4)],
  ],
  (args) => args as Offer
);

export type LastUpdate = {
  slot: BigNumber;
  timestamp: BigNumber;
  stale: number;
  _padding: Uint8Array;
};

const lastUpdateStruct = new BeetStruct<LastUpdate>(
  [
    ['slot', u64],
    ['timestamp', u64],
    ['stale', u8],
    ['_padding', blob(15)],
  ],
  (args) => args as LastUpdate
);

export type DepositedCollateral = {
  deposit_reserve: PublicKey;
  entry_market_value: BigNumber;
  market_value: BigNumber;
  deposited_amount: BigNumber;
  memo: Uint8Array;
};

const depositedCollateralStruct = new BeetStruct<DepositedCollateral>(
  [
    ['deposit_reserve', publicKey],
    ['entry_market_value', u128],
    ['market_value', u128],
    ['deposited_amount', u64],
    ['memo', blob(24)],
  ],
  (args) => args as DepositedCollateral
);

export type BorrowedLiquidity = {
  borrow_reserve: PublicKey;
  cumulative_borrow_rate: BigNumber;
  borrowed_amount: BigNumber;
  market_value: BigNumber;
  entry_market_value: BigNumber;
  memo: Uint8Array;
};

const borrowedLiquidityStruct = new BeetStruct<BorrowedLiquidity>(
  [
    ['borrow_reserve', publicKey],
    ['cumulative_borrow_rate', u128],
    ['borrowed_amount', u128],
    ['market_value', u128],
    ['market_value', u128],
    ['memo', blob(32)],
  ],
  (args) => args as BorrowedLiquidity
);

export type Position = {
  accountDiscriminator: number[];
  version: number;
  position_type: number;
  _flags: Buffer;
  last_update: LastUpdate;
  pool: PublicKey;
  owner: PublicKey;
  collateral: DepositedCollateral[];
  borrows: BorrowedLiquidity[];
};

export const positionStruct = new BeetStruct<Position>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['position_type', u8],
    ['_flags', blob(6)],
    ['last_update', lastUpdateStruct],
    ['pool', publicKey],
    ['owner', publicKey],
    ['collateral', uniformFixedSizeArray(depositedCollateralStruct, 10)],
    ['borrows', uniformFixedSizeArray(borrowedLiquidityStruct, 10)],
  ],
  (args) => args as Position
);

export type ReserveLiquidity = {
  mint: PublicKey;
  borrowed_amount_wads: BigNumber;
  cumulative_borrow_rate_wads: BigNumber;
  market_price: BigNumber;
  curator_performance_fee_wads: BigNumber;
  texture_performance_fee_wads: BigNumber;
  borrow_rate: BigNumber;
  available_amount: BigNumber;
  _padding: BigNumber;
  mint_decimals: number;
  _padding1: Uint8Array;
};

export const reserveLiquidityStruct = new BeetStruct<ReserveLiquidity>(
  [
    ['mint', publicKey],
    ['borrowed_amount_wads', u128],
    ['cumulative_borrow_rate_wads', u128],
    ['market_price', u128],
    ['curator_performance_fee_wads', u128],
    ['texture_performance_fee_wads', u128],
    ['borrow_rate', u128],
    ['available_amount', u64],
    ['_padding', u64],
    ['mint_decimals', u8],
    ['_padding1', blob(15 + 32 * 2)],
  ],
  (args) => args as ReserveLiquidity
);

export type ReserveCollateral = {
  lp_total_supply: BigNumber;
  _padding: BigNumber;
};

const reserveCollateralStruct = new BeetStruct<ReserveCollateral>(
  [
    ['lp_total_supply', u64],
    ['_padding', u64],
  ],
  (args) => args as ReserveCollateral
);

export type Reserve = {
  accountDiscriminator: number[];
  version: number;
  reserve_type: number;
  mode: number;
  _flags: Uint8Array;
  last_update: LastUpdate;
  pool: PublicKey;
  liquidity: ReserveLiquidity;
  collateral: ReserveCollateral;
};

export const reserveStruct = new BeetStruct<Reserve>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['reserve_type', u8],
    ['mode', u8],
    ['_flags', blob(5)],
    ['last_update', lastUpdateStruct],
    ['pool', publicKey],
    ['liquidity', reserveLiquidityStruct],
    ['collateral', reserveCollateralStruct],
  ],
  (args) => args as Reserve
);
