import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  u8,
  FixableBeetStruct,
  uniformFixedSizeArray,
  COption,
  coption,
  u16,
  BeetStruct,
  i32,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { f64, i64, u128, u64 } from '../../utils/solana';

export enum LendOfferStatus {
  Created = 0,
  Canceling = 1,
  Canceled = 2,
  Loaned = 3,
}

export enum LoanOfferStatus {
  Matched = 0,
  FundTransferred = 1,
  Repay = 2,
  BorrowerPaid = 3,
  Liquidating = 4,
  Liquidated = 5,
  Finished = 6,
}

export type LendOfferAccount = {
  accountDiscriminator: number[];
  interest: number;
  lenderFeePercent: number;
  duration: BigNumber;
  offerIdsLength: number[];
  offerId: number[];
  lender: PublicKey;
  lendMintToken: PublicKey;
  amount: BigNumber;
  bump: number;
  status: LendOfferStatus;
};

export const lendOfferAccountStruct = new BeetStruct<LendOfferAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['interest', u16],
    ['lenderFeePercent', f64],
    ['duration', u64],
    ['offerIdsLength', uniformFixedSizeArray(u8, 4)],
    ['offerId', uniformFixedSizeArray(u8, 32)],
    ['lender', publicKey],
    ['lendMintToken', publicKey],
    ['amount', u64],
    ['bump', u8],
    ['status', u8],
  ],
  (args) => args as LendOfferAccount
);

export type LoanOfferAccount = {
  accountDiscriminator: number[];
  tierId: number[];
  lendOfferId: number[];
  interest: number;
  borrowAmount: BigNumber;
  lenderFeePercent: number;
  duration: BigNumber;
  lendMintToken: PublicKey;
  lender: PublicKey;
  offerId: number[];
  borrower: PublicKey;
  collateralMintToken: PublicKey;
  collateralAmount: BigNumber;
  requestWithdrawAmount: COption<BigNumber>;
  status: LoanOfferStatus;
  borrowerFeePercent: number;
  startedAt: BigNumber;
  liquidatingAt: COption<BigNumber>;
  liquidatingPrice: COption<number>;
  liquidatedTx: COption<number[]>;
  liquidatedPrice: COption<BigNumber>;
  bump: number;
};

export const loanOfferAccountStruct = new FixableBeetStruct<LoanOfferAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['tierId', uniformFixedSizeArray(u8, 30)],
    ['lendOfferId', uniformFixedSizeArray(u8, 30)],
    ['interest', f64],
    ['borrowAmount', u64],
    ['lenderFeePercent', f64],
    ['duration', u64],
    ['lendMintToken', publicKey],
    ['lender', publicKey],
    ['offerId', uniformFixedSizeArray(u8, 30)],
    ['borrower', publicKey],
    ['collateralMintToken', publicKey],
    ['collateralAmount', u64],
    ['requestWithdrawAmount', coption(u64)],
    ['status', u8],
    ['borrowerFeePercent', f64],
    ['startedAt', i64],
    ['liquidatingAt', i64],
    ['liquidatingPrice', f64],
    ['liquidatedTx', uniformFixedSizeArray(u8, 30)],
    ['liquidatedPrice', u64],
    ['bump', u8],
  ],
  (args) => args as LoanOfferAccount
);

export type UserPosition = {
  accountDiscriminator: number[];
  bump: number;
  protocol_position: PublicKey;
  owner: PublicKey;
  liquidity: BigNumber;
  fee_growth_inside_0: BigNumber;
  fee_growth_inside_1: BigNumber;
  token_fee_owed_0: BigNumber;
  token_fee_owed_1: BigNumber;
  token_fee_claimed_0: BigNumber;
  token_fee_claimed_1: BigNumber;
  version: BigNumber;
  padding: BigNumber[];
};

export const userPositionStruct = new BeetStruct<UserPosition>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['protocol_position', publicKey],
    ['owner', publicKey],
    ['liquidity', u128],
    ['fee_growth_inside_0', u128],
    ['fee_growth_inside_1', u128],
    ['token_fee_owed_0', u64],
    ['token_fee_owed_1', u64],
    ['token_fee_claimed_0', u64],
    ['token_fee_claimed_1', u64],
    ['version', u64],
    ['padding', uniformFixedSizeArray(u64, 6)],
  ],
  (args) => args as UserPosition
);

export type PositionRewardInfo = {
  reward_growth_inside: BigNumber;
  reward_amount_owed: BigNumber;
  reward_vault: PublicKey | null;
};

export const positionRewardInfoStruct = new BeetStruct<PositionRewardInfo>(
  [
    ['reward_growth_inside', u128],
    ['reward_amount_owed', u64],
    ['reward_vault', publicKey],
  ],
  (args) => args as PositionRewardInfo
);

export enum ProtocolPositionStatus {
  Active = 0,
  ReBalancing = 1,
  ReOpened = 2,
}

export type ProtocolPosition = {
  accountDiscriminator: number[];
  bump: number;
  system_config: PublicKey;
  position_mint: PublicKey;
  pool_address: PublicKey;
  tick_lower_index: number;
  tick_upper_index: number;
  liquidity: BigNumber;
  fee_growth_inside_0: BigNumber;
  fee_growth_inside_1: BigNumber;
  amount_0_reserve: BigNumber;
  amount_1_reserve: BigNumber;
  token_vault_0: PublicKey;
  token_vault_1: PublicKey;
  reward_infos: PositionRewardInfo[];
  recent_epoch: BigNumber;
  authority_position: PublicKey;
  status: ProtocolPositionStatus;
  version: BigNumber;
  old_liquidity: BigNumber;
  padding: BigNumber[];
};

export const protocolPositionStruct = new BeetStruct<ProtocolPosition>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['system_config', publicKey],
    ['position_mint', publicKey],
    ['pool_address', publicKey],
    ['tick_lower_index', i32],
    ['tick_upper_index', i32],
    ['liquidity', u128],
    ['fee_growth_inside_0', u128],
    ['fee_growth_inside_1', u128],
    ['amount_0_reserve', u64],
    ['amount_1_reserve', u64],
    ['token_vault_0', publicKey],
    ['token_vault_1', publicKey],
    ['reward_infos', uniformFixedSizeArray(positionRewardInfoStruct, 3)],
    ['recent_epoch', u64],
    ['authority_position', publicKey],
    ['status', u8],
    ['version', u64],
    ['old_liquidity', u128],
    ['padding', uniformFixedSizeArray(u64, 4)],
  ],
  (args) => args as ProtocolPosition
);

export type ProtocolPositionState = {
  accountDiscriminator: number[];
  bump: number;
  pool_id: PublicKey;
  tick_lower_index: number;
  tick_upper_index: number;
  liquidity: BigNumber;
  fee_growth_inside_0_last_x64: BigNumber;
  fee_growth_inside_1_last_x64: BigNumber;
  token_fees_owed_0: BigNumber;
  token_fees_owed_1: BigNumber;
  reward_growth_inside: BigNumber[];
  padding: BigNumber[];
};

export const protocolPositionStateStruct =
  new BeetStruct<ProtocolPositionState>(
    [
      ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
      ['bump', u8],
      ['pool_id', publicKey],
      ['tick_lower_index', i32],
      ['tick_upper_index', i32],
      ['liquidity', u128],
      ['fee_growth_inside_0_last_x64', u128],
      ['fee_growth_inside_1_last_x64', u128],
      ['token_fees_owed_0', u64],
      ['token_fees_owed_1', u64],
      ['reward_growth_inside', uniformFixedSizeArray(u128, 3)],
      ['padding', uniformFixedSizeArray(u64, 8)],
    ],
    (args) => args as ProtocolPositionState
  );

export type BigFractionBytes = {
  value0: BigNumber;
  value1: BigNumber;
  value2: BigNumber;
  value3: BigNumber;
  padding: BigNumber;
  padding1: BigNumber;
};

const bigFractionBytesStruct = new BeetStruct<BigFractionBytes>(
  [
    ['value0', u64],
    ['value1', u64],
    ['value2', u64],
    ['value3', u64],
    ['padding', u64],
    ['padding1', u64],
  ],
  (args) => args as BigFractionBytes
);

type LastUpdate = {
  slot: BigNumber;
  stale: number;
  price_status: number;
  padding: number[];
};

const lastUpdateStruct = new BeetStruct<LastUpdate>(
  [
    ['slot', u64],
    ['stale', u8],
    ['price_status', u8],
    ['padding', uniformFixedSizeArray(u8, 6)],
  ],
  (args) => args as LastUpdate
);

type ObligationCollateral = {
  reserve_storage: PublicKey;
  deposited_amount: BigNumber;
  market_value_sf: BigNumber;
};

const obligationCollateralStruct = new BeetStruct<ObligationCollateral>(
  [
    ['reserve_storage', publicKey],
    ['deposited_amount', u64],
    ['market_value_sf', u128],
  ],
  (args) => args as ObligationCollateral
);

type ObligationLiquidity = {
  reserve_storage: PublicKey;
  cumulative_borrow_rate_bsf: BigFractionBytes;
  borrowed_amount_sf: BigNumber;
  market_value_sf: BigNumber;
  borrow_factor_adjusted_market_value_sf: BigNumber;
};

const obligationLiquidityStruct = new BeetStruct<ObligationLiquidity>(
  [
    ['reserve_storage', publicKey],
    ['cumulative_borrow_rate_bsf', bigFractionBytesStruct],
    ['borrowed_amount_sf', u128],
    ['market_value_sf', u128],
    ['borrow_factor_adjusted_market_value_sf', u128],
  ],
  (args) => args as ObligationLiquidity
);

export type ObligationFlex = {
  accountDiscriminator: number[];
  version: number;
  owner: PublicKey;
  lowest_reserve_deposit_liquidation_ltv: BigNumber;
  total_deposited_value_sf: BigNumber;
  deposits: ObligationCollateral[];
  padding_1: ObligationCollateral[];
  borrow_factor_adjusted_debt_value_sf: BigNumber;
  borrowed_assets_market_value_sf: BigNumber;
  highest_borrow_factor_pct: BigNumber;
  allowed_borrow_value_sf: BigNumber;
  unhealthy_borrow_value_sf: BigNumber;
  borrows: ObligationLiquidity[];
  padding_2: ObligationLiquidity[];
  deposit_asset_tier: number[];
  padding_3: number[];
  borrow_asset_tier: number[];
  padding_4: number[];
  num_of_obsolete_reserves: number;
  has_debt: number;
  last_update: LastUpdate;
  locking: number;
  liquidating_asset_position: number;
};

export const obligationFlexStruct = new FixableBeetStruct<ObligationFlex>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['owner', publicKey],
    ['lowest_reserve_deposit_liquidation_ltv', u64],
    ['total_deposited_value_sf', u128],
    ['deposits', uniformFixedSizeArray(obligationCollateralStruct, 3)],
    ['padding_1', uniformFixedSizeArray(obligationCollateralStruct, 10)],
    ['borrow_factor_adjusted_debt_value_sf', u128],
    ['borrowed_assets_market_value_sf', u128],
    ['highest_borrow_factor_pct', u64],
    ['allowed_borrow_value_sf', u128],
    ['unhealthy_borrow_value_sf', u128],
    ['borrows', uniformFixedSizeArray(obligationLiquidityStruct, 3)],
    ['padding_2', uniformFixedSizeArray(obligationLiquidityStruct, 10)],
    ['deposit_asset_tier', uniformFixedSizeArray(u8, 3)],
    ['padding_3', uniformFixedSizeArray(u8, 10)],
    ['borrow_asset_tier', uniformFixedSizeArray(u8, 3)],
    ['padding_4', uniformFixedSizeArray(u8, 10)],
    ['num_of_obsolete_reserves', u8],
    ['has_debt', u8],
    ['last_update', lastUpdateStruct],
    ['locking', u8],
    ['liquidating_asset_position', u8],
  ],
  (args) => args as ObligationFlex
);

type ReserveLiquidity = {
  token_mint: PublicKey;
  supply_vault: PublicKey;
  fee_vault: PublicKey;
  available_amount: BigNumber;
  borrowed_amount_sf: BigNumber;
  market_price_sf: BigNumber;
  market_price_last_updated_ts: BigNumber;
  mint_decimals: number;
  deposit_limit_crossed_ts: BigNumber;
  borrow_limit_crossed_ts: BigNumber;
  cumulative_borrow_rate_bsf: BigFractionBytes;
  accumulated_protocol_fees_sf: BigNumber;
  token_program: PublicKey;
};

const reserveLiquidityStruct = new BeetStruct<ReserveLiquidity>(
  [
    ['token_mint', publicKey],
    ['supply_vault', publicKey],
    ['fee_vault', publicKey],
    ['available_amount', u64],
    ['borrowed_amount_sf', u128],
    ['market_price_sf', u128],
    ['market_price_last_updated_ts', u64],
    ['mint_decimals', u8],
    ['deposit_limit_crossed_ts', u64],
    ['borrow_limit_crossed_ts', u64],
    ['cumulative_borrow_rate_bsf', bigFractionBytesStruct],
    ['accumulated_protocol_fees_sf', u128],
    ['token_program', publicKey],
  ],
  (args) => args as ReserveLiquidity
);

type ReserveCollateral = {
  token_mint: PublicKey;
  mint_total_supply: BigNumber;
  supply_vault: PublicKey;
};

const reserveCollateralStruct = new BeetStruct<ReserveCollateral>(
  [
    ['token_mint', publicKey],
    ['mint_total_supply', u64],
    ['supply_vault', publicKey],
  ],
  (args) => args as ReserveCollateral
);

export type Reserve = {
  accountDiscriminator: number[];
  version: number;
  padding: number[];
  liquidity: ReserveLiquidity;
  collateral: ReserveCollateral;
};

export const reserveStruct = new FixableBeetStruct<Reserve>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['padding', uniformFixedSizeArray(u8, 7)],
    ['liquidity', reserveLiquidityStruct],
    ['collateral', reserveCollateralStruct],
  ],
  (args) => args as Reserve
);
