import {
  BeetStruct,
  u8,
  bool,
  u32,
  uniformFixedSizeArray,
  i8,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u64, u128, i64 } from '../../utils/solana'; // Assuming custom utility for blob

const rateBeet = new BeetStruct<Rate>(
  [
    ['lastUpdated', i64],
    ['lastValue', u32],
    ['align0', uniformFixedSizeArray(u8, 4)],
    ['lastEmaHourUpdated', i64],
    ['emaHourly', u32],
    ['align1', uniformFixedSizeArray(u8, 4)],
    ['lastEmaDayUpdated', i64],
    ['ema3d', u32],
    ['ema7d', u32],
    ['ema14d', u32],
    ['ema30d', u32],
    ['ema90d', u32],
    ['ema180d', u32],
    ['ema365d', u32],
  ],
  (args) => args as Rate
);

interface Rate {
  lastUpdated: number;
  lastValue: BigNumber;
  align0: number[];
  lastEmaHourUpdated: number;
  emaHourly: BigNumber;
  align1: number[];
  lastEmaDayUpdated: number;
  ema3d: number;
  ema7d: number;
  ema14d: number;
  ema30d: number;
  ema90d: number;
  ema180d: number;
  ema365d: number;
}

// Define the VaultEarn struct using BeetStruct
export const vaultEarnBeet = new BeetStruct<VaultEarn>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['isInitialized', bool], // bool is 1 byte
    ['version', u8], // u8 is 1 byte
    ['bump', u8], // u8 is 1 byte
    ['align0', uniformFixedSizeArray(u8, 5)], // array of 5 u8, 5 bytes
    ['protocol', publicKey], // publicKey is 32 bytes
    ['earnStats', publicKey], // publicKey is 32 bytes
    ['creator', publicKey], // publicKey is 32 bytes
    ['authority', publicKey], // publicKey is 32 bytes
    ['earnConfig', publicKey], // publicKey is 32 bytes
    ['vaultLiquidity', publicKey], // publicKey is 32 bytes
    ['priceOracle', publicKey], // publicKey is 32 bytes
    ['priceFeed', uniformFixedSizeArray(u8, 64)], // array of 64 u8, 64 bytes
    ['tokenProgram', publicKey], // publicKey is 32 bytes
    ['tokenMint', publicKey], // publicKey is 32 bytes
    ['tokenDecimal', u8], // u8 is 1 byte
    ['align1', uniformFixedSizeArray(u8, 7)], // array of 7 u8, 7 bytes
    ['lastUpdated', u64], // i64 is 8 bytes
    ['unitSupply', u128], // u128 is 16 bytes
    ['unitBorrowed', u128], // u128 is 16 bytes
    ['unitLent', u128], // u128 is 16 bytes
    ['unitLeverage', u128], // u128 is 16 bytes
    ['index', u128], // u128 is 16 bytes
    ['lastIndexUpdated', i64], // i64 is 8 bytes
    ['apy', rateBeet], // Assuming "rate" is represented as u128
    ['padding1', uniformFixedSizeArray(u8, 64)], // array of 64 u64, 64 * 8 = 512 bytes
  ],
  (args) => args as VaultEarn
);

// Define the VaultEarn interface to match the struct
export interface VaultEarn {
  discriminator: number[];
  isInitialized: boolean;
  version: number;
  bump: number;
  align0: number[];
  protocol: PublicKey;
  earnStats: PublicKey;
  creator: PublicKey;
  authority: PublicKey;
  earnConfig: PublicKey;
  vaultLiquidity: PublicKey;
  priceOracle: PublicKey;
  priceFeed: number[];
  tokenProgram: PublicKey;
  tokenMint: PublicKey;
  tokenDecimal: number;
  align1: number[];
  lastUpdated: BigNumber;
  unitSupply: string; // u128
  unitBorrowed: string; // u128
  unitLent: string; // u128
  unitLeverage: string; // u128
  index: BigNumber; // u128
  lastIndexUpdated: number;
  apy: Rate; // u128
  padding1: Buffer[];
}

export const earnLenderBeet = new BeetStruct<EarnLender>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['is_initialized', bool], // bool is 1 byte
    ['version', u8], // u8 is 1 byte
    ['bump', u8], // u8 is 1 byte
    ['align', uniformFixedSizeArray(u8, 5)], // array of 5 u8, 5 bytes
    ['owner', publicKey], // publicKey is 32 bytes
    ['protocol', publicKey], // publicKey is 32 bytes
    ['vault', publicKey], // publicKey is 32 bytes
    ['last_updated', i64], // i64 is 8 bytes
    ['pending_deposit_amount', u64], // i64 is 8 bytes
    ['pending_deposit_unit', u64], // i64 is 8 bytes
    ['pending_deposit_index', u128], // i64 is 8 bytes
    ['pending_withdraw_amount', u64], // i64 is 8 bytes
    ['pending_withdraw_unit', u64], // i64 is 8 bytes
    ['pending_withdraw_index', u128], // i64 is 8 bytes
    ['unit', u64], // i64 is 8 bytes
    ['index', u128], // i64 is 8 bytes
    ['padding1', uniformFixedSizeArray(u64, 10)], // array of 64 u64, 64 * 8 = 512 bytes
  ],
  (args) => args as EarnLender
);

export interface EarnLender {
  discriminator: number[];
  is_initialized: boolean;
  version: number;
  bump: number;
  align: number[];
  owner: PublicKey;
  protocol: PublicKey;
  vault: PublicKey;
  last_updated: BigNumber;
  pending_deposit_amount: BigNumber;
  pending_deposit_unit: BigNumber;
  pending_deposit_index: BigNumber;
  pending_withdraw_amount: BigNumber;
  pending_withdraw_unit: BigNumber;
  pending_withdraw_index: BigNumber;
  unit: BigNumber;
  index: BigNumber;
  padding1: BigNumber[];
}

export const vaultLeverageBeet = new BeetStruct<VaultLeverage>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['isInitialized', bool], // bool is 1 byte
    ['version', u8],
    ['bump', u8],
    ['align0', uniformFixedSizeArray(u8, 5)], // array of 5 u8, 5 bytes
    ['protocol', publicKey], // publicKey is 32 bytes
    ['leverageStats', publicKey], // publicKey is 32 bytes
    ['creator', publicKey], // publicKey is 32 bytes
    ['authority', publicKey], // publicKey is 32 bytes
    ['leverageConfig', publicKey], // publicKey is 32 bytes
    ['borrowVault', publicKey], // publicKey is 32 bytes
    ['tokenCollateralPriceOracle', publicKey], // publicKey is 32 bytes
    ['tokenCollateralPriceFeed', uniformFixedSizeArray(u8, 64)], // array of 5 u8, 5 bytes
    ['tokenCollateralTokenProgram', publicKey], // publicKey is 32 bytes
    ['tokenCollateralTokenMint', publicKey], // publicKey is 32 bytes
    ['tokenCollateralVaultLiquidity', publicKey], // publicKey is 32 bytes
    ['tokenCollateralTokenDecimal', u8],
    ['align1', uniformFixedSizeArray(u8, 7)], // array of 5 u8, 5 bytes
    ['nativeCollateralPriceOracle', publicKey], // publicKey is 32 bytes
    ['nativeCollateralPriceFeed', uniformFixedSizeArray(u8, 64)], // array of 5 u8, 5 bytes
    ['nativeCollateralTokenProgram', publicKey], // publicKey is 32 bytes
    ['nativeCollateralTokenMint', publicKey], // publicKey is 32 bytes
    ['nativeCollateralVaultLiquidity', publicKey], // publicKey is 32 bytes
    ['nativeCollateralTokenDecimal', u8],
    ['align2', uniformFixedSizeArray(u8, 7)], // array of 5 u8, 5 bytes
    ['lastUpdated', i64],
    ['borrowingUnitSupply', u128],
    ['borrowingIndex', u128],
    ['unitSupply', u128],
    ['index', u128],
    ['lastIndexUpdated', i64],
    ['borrowingApy', rateBeet],
    ['apy', rateBeet],
    ['padding1', uniformFixedSizeArray(u64, 10)], // array of 64 u64, 64 * 8 = 512 bytes
  ],
  (args) => args as VaultLeverage
);

export interface VaultLeverage {
  discriminator: number[];
  isInitialized: boolean;
  version: number;
  bump: number;
  align0: number[];
  protocol: PublicKey;
  leverageStats: PublicKey;
  creator: PublicKey;
  authority: PublicKey;
  leverageConfig: PublicKey;
  borrowVault: PublicKey;
  tokenCollateralPriceOracle: PublicKey;
  tokenCollateralPriceFeed: number[];
  tokenCollateralTokenProgram: PublicKey;
  tokenCollateralTokenMint: PublicKey;
  tokenCollateralVaultLiquidity: PublicKey;
  tokenCollateralTokenDecimal: number;
  align1: number[];
  nativeCollateralPriceOracle: PublicKey;
  nativeCollateralPriceFeed: number[];
  nativeCollateralTokenProgram: PublicKey;
  nativeCollateralTokenMint: PublicKey;
  nativeCollateralVaultLiquidity: PublicKey;
  nativeCollateralTokenDecimal: number;
  align2: number[];
  lastUpdated: BigNumber;
  borrowingUnitSupply: number;
  borrowingIndex: number;
  unitSupply: number;
  index: number;
  lastIndexUpdated: BigNumber;
  borrowingApy: Rate;
  apy: Rate;
  padding1: BigNumber[];
}

export enum LeverageAction {
  Idle = 0,
  Open = 1,
  AddCollateral = 2,
  AddPosition = 3,
  Close = 4,
  Safe = 5,
  Eject = 6,
  Liquidate = 7,
  Deleverage = 8,
  TakeProfit = 9,
}

export const leveragePositionStateBeet = new BeetStruct<LeveragePositionState>(
  [
    ['action', u8], // Enum field
    ['align01', uniformFixedSizeArray(u8, 7)],
    ['token_collateral_price_oracle', publicKey],
    ['token_collateral_price_feed', uniformFixedSizeArray(u8, 64)],
    ['token_collateral_price', u64],
    ['token_collateral_price_exponent', u32],
    ['align0', uniformFixedSizeArray(u8, 4)],
    ['native_collateral_price_oracle', publicKey],
    ['native_collateral_price_feed', uniformFixedSizeArray(u8, 64)],
    ['native_collateral_price', u64],
    ['native_collateral_price_exponent', u32],
    ['protocol_fee', u32],
    ['leverage_fee', u32],
    ['deleverage_fee', u32],
    ['closing_fee', u32],
    ['spread_rate', u32],
    ['liquidation_fee', u32],
    ['liquidation_threshold', u32],
    ['liquidation_protocol_ratio', u32],
    ['slippage_rate', u32],
    ['emergency_eject_period', i64],
    ['saver_threshold', u32],
    ['saver_target_reduction', u32],
    ['fund_amount', u64],
    ['leverage_fee_amount', u64],
    ['borrow_amount', u64],
    ['borrowing_fee_amount', u64],
    ['borrowing_unit', u64],
    ['borrowing_index', u128],
    ['leveraged_amount', u64],
    ['min_native_collateral_output', u64],
    ['release_amount', u64],
    ['release_unit', u64],
    ['release_index', u128],
    ['release_rate', u32],
    ['align1', uniformFixedSizeArray(u8, 4)],
    ['repay_amount', u64],
    ['repay_unit', u64],
    ['repay_index', u128],
    ['release_min_output', u64],
    ['release_current_leverage', u32],
    ['release_target_leverage', u32],
    ['utilization_rate', u32],
    ['align2', uniformFixedSizeArray(u8, 4)],
    ['protocol_fee_factor', u128],
    ['protocol_fee_amount', u64],
    ['repay_borrow_amount', u64],
    ['liquidation_fee_amount', u64],
    ['health_factor', u32],
    ['borrow_fee', u32],
    ['padding1', uniformFixedSizeArray(u64, 63)], // array of 64 u64, 64 * 8 = 512 bytes
  ],
  (args) => args as LeveragePositionState
);

export interface LeveragePositionState {
  action: LeverageAction; // Enum field
  align01: number[];
  token_collateral_price_oracle: PublicKey;
  token_collateral_price_feed: number[];
  token_collateral_price: BigNumber;
  token_collateral_price_exponent: BigNumber;
  align0: number[];
  native_collateral_price_oracle: PublicKey;
  native_collateral_price_feed: number[];
  native_collateral_price: BigNumber;
  native_collateral_price_exponent: BigNumber;
  protocol_fee: BigNumber;
  leverage_fee: BigNumber;
  deleverage_fee: BigNumber;
  closing_fee: BigNumber;
  spread_rate: BigNumber;
  liquidation_fee: BigNumber;
  liquidation_threshold: BigNumber;
  liquidation_protocol_ratio: BigNumber;
  slippage_rate: BigNumber;
  emergency_eject_period: BigNumber;
  saver_threshold: BigNumber;
  saver_target_reduction: BigNumber;
  fund_amount: BigNumber;
  leverage_fee_amount: BigNumber;
  borrow_amount: BigNumber;
  borrowing_fee_amount: BigNumber;
  borrowing_unit: BigNumber;
  borrowing_index: BigNumber;
  leveraged_amount: BigNumber;
  min_native_collateral_output: BigNumber;
  release_amount: BigNumber;
  release_unit: BigNumber;
  release_index: BigNumber;
  release_rate: BigNumber;
  align1: number[];
  repay_amount: BigNumber;
  repay_unit: BigNumber;
  repay_index: BigNumber;
  release_min_output: BigNumber;
  release_current_leverage: BigNumber;
  release_target_leverage: BigNumber;
  utilization_rate: BigNumber;
  align2: number[];
  protocol_fee_factor: BigNumber;
  protocol_fee_amount: BigNumber;
  repay_borrow_amount: BigNumber;
  liquidation_fee_amount: BigNumber;
  health_factor: BigNumber;
  borrow_fee: BigNumber;
  padding1: BigNumber[];
}

export const leveragePositionBeet = new BeetStruct<LeveragePosition>(
  [
    ['owner', publicKey],
    ['id', publicKey],
    ['tag_id', uniformFixedSizeArray(u8, 64)],
    ['number', i8],
    ['align0', uniformFixedSizeArray(u8, 7)],
    ['open_at', i64],
    ['last_updated', i64],
    ['emergency_eject', bool], // bool is 1 byte
    ['safety_mode', bool], // bool is 1 byte
    ['safety_level', u8],
    ['align1', uniformFixedSizeArray(u8, 5)],
    ['token_collateral_amount', u64],
    ['token_to_native_ratio', u128],
    ['borrowing_unit', u64],
    ['avg_borrowing_index', u128],
    ['unit', u64],
    ['avg_index', u128],
    ['state', leveragePositionStateBeet],
    ['token_collateral_price_oracle', publicKey],
    ['token_collateral_price_feed', uniformFixedSizeArray(u8, 64)],
    ['token_collateral_price', u64],
    ['token_collateral_price_exponent', u32],
    ['align2', uniformFixedSizeArray(u8, 4)],
    ['native_collateral_price_oracle', publicKey],
    ['native_collateral_price_feed', uniformFixedSizeArray(u8, 64)],
    ['native_collateral_price', u64],
    ['native_collateral_price_exponent', u32],
    ['profit_taker', bool],
    ['align3', uniformFixedSizeArray(u8, 3)],
    ['profit_target_rate', u32],
    ['profit_taking_rate', u32],
    ['padding1', uniformFixedSizeArray(u64, 63)], // array of 64 u64, 64 * 8 = 512 bytes
  ],
  (args) => args as LeveragePosition
);

export interface LeveragePosition {
  owner: PublicKey;
  id: PublicKey;
  tag_id: number[];
  number: number;
  align0: number[];
  open_at: BigNumber;
  last_updated: BigNumber;
  emergency_eject: boolean;
  safety_mode: boolean;
  safety_level: number;
  align1: number[];
  token_collateral_amount: BigNumber;
  token_to_native_ratio: BigNumber;
  borrowing_unit: BigNumber;
  avg_borrowing_index: BigNumber;
  unit: BigNumber;
  avg_index: BigNumber;
  state: LeveragePositionState;
  token_collateral_price_oracle: PublicKey;
  token_collateral_price_feed: number[];
  token_collateral_price: BigNumber;
  token_collateral_price_exponent: number;
  align2: number[];
  native_collateral_price_oracle: PublicKey;
  native_collateral_price_feed: number[];
  native_collateral_price: BigNumber;
  native_collateral_price_exponent: BigNumber;
  profit_taker: boolean;
  align3: number[];
  profit_target_rate: BigNumber;
  profit_taking_rate: BigNumber;
  padding1: BigNumber[];
}

export const leverageObligationBeet = new BeetStruct<LeverageObligation>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['is_initialized', bool], // bool is 1 byte
    ['version', u8], // u8 is 1 byte
    ['bump', u8], // u8 is 1 byte
    ['align', uniformFixedSizeArray(u8, 5)], // array of 5 u8, 5 bytes
    ['owner', publicKey], // publicKey is 32 bytes
    ['protocol', publicKey], // publicKey is 32 bytes
    ['vault', publicKey], // publicKey is 32 bytes
    ['borrow_vault', publicKey], // publicKey is 32 bytes
    ['last_updated', i64], // i64 is 8 bytes
    ['positions', uniformFixedSizeArray(leveragePositionBeet, 3)],
    ['padding1', uniformFixedSizeArray(u64, 64)], // array of 64 u64, 64 * 8 = 512 bytes
  ],
  (args) => args as LeverageObligation
);

export interface LeverageObligation {
  discriminator: number[];
  is_initialized: boolean;
  version: number;
  bump: number;
  align: number[];
  owner: PublicKey;
  protocol: PublicKey;
  vault: PublicKey;
  borrow_vault: PublicKey;
  last_updated: BigNumber;
  positions: LeveragePosition[];
  padding1: BigNumber[];
}
