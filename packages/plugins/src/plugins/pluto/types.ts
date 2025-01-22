import { ID } from '../../utils/sui/types/id';

export type Receipt = {
  id: ID;
  amountDeposited: string;
};

export type LeverageVault = {
  earnName: string
  leverageName: string
  programId: string
  protocol: string
  indexer: string
  keeper: string
  feeVault: string
  tokenProgramA: string
  tokenMintA: string
  tokenDecimalA: number
  tokenCollateralPriceOracle: string
  tokenCollateralPriceFeed: string
  tokenProgramB: string
  tokenMintB: string
  tokenDecimalB: number
  nativeCollateralPriceOracle: string
  nativeCollateralPriceFeed: string
  earnConfig: string
  earnStats: string
  earnVaultAuthority: string
  earnVault: string
  earnVaultLiquidity: string
  leverageConfig: string
  leverageStats: string
  leverageVaultAuthority: string
  leverageVault: string
  leverageVaultTokenCollateralLiquidity: string
  leverageVaultNativeCollateralLiquidity: string
  lookupTable: string
}

export type EarnVault = {
  symbol: string
  earn_vault_address: string
  earn_vault_liquidity_address: string
  earn_config_address: string
  earn_stats_address: string
  active_user: string
  tvl: string
  supply_unit: string
  borrowed_unit: string
  index: string
  supply_amount: string
  supply_amount_usd: string
  borrowed_amount: string
  borrowed_amount_usd: string
  utilization_rate: string
  loan_to_value_rate: string
  borrowable_amount: string
  borrowable_amount_usd: string
  available_to_borrow_amount: string
  available_to_borrow_amount_usd: string
  protocol_fee_rate: string
  deposit_fee_rate: string
  deposit_min_amount: string
  deposit_max_amount: string
  withdraw_fee_rate: string
  withdraw_min_amount: string
  withdraw_max_amount: string
  borrow_open_fee_rate: string
  borrow_min_amount: string
  borrow_max_amount: string
  floor_cap_rate: string
  floor_cap_apy: string
  ceiling_cap_apy: string
  blended_apy: string
  weighted_leverage: string
  leveraged_apy: string
  supply_apy: string
  borrow_apy: string
  supply_apy_24h: string
  supply_apy_3d: string
  supply_apy_7d: string
  supply_apy_30d: string
  supply_apy_90d: string
  supply_apy_180d: string
  supply_apy_365d: string
}

export interface GetLeverage {
  data: LeverageData[];
}

export interface LeverageData {
  symbol: string
  leverage_vault_address: string
  owner_address: string
  obligation_address: string
  tvl: string
  amount: string
  amount_usd: string
  collateral_amount: string
  collateral_amount_usd: string
  borrowing_amount: string
  borrowing_amount_usd: string
  vault_position: string
  vault_position_usd: string
  vault_position_unit: string
  vault_index: string
  vault_borrowing_amount: string
  vault_borrowing_amount_usd: string
  vault_borrowing_unit: string
  vault_borrowing_index: string
  vault_blended_apy: string
  vault_weighted_leverage: string
  vault_floor_cap_apy: string
  vault_ceiling_cap_apy: string
  vault_borrow_apy: string
  vault_supply_apy: string
  vault_leverage_apy: string
  vault_net_apy: string
  asset_to_vault_rate: string
  roi_amount: string
  roi_amount_usd: string
  roi_rate: string
  positions: Position[]
}

export interface Position {
  symbol: string
  leverage_vault_address: string
  owner_address: string
  obligation_address: string
  position_id: string
  position_number: number
  open_at: string
  tvl: string
  unit: string
  avg_index: string
  last_index: string
  amount: string
  amount_usd: string
  borrowing_unit: string
  borrowing_avg_index: string
  borrowing_last_index: string
  borrowing_amount: string
  borrowing_amount_usd: string
  collateral_amount: string
  collateral_amount_usd: string
  leverage: string
  lv_collateral_amount: string
  lv_collateral_amount_usd: string
  lv_leverage: string
  current_collateral_amount: string
  current_collateral_amount_usd: string
  current_leverage: string
  safety_mode: boolean
  emergency_eject: boolean
  profit_taker: boolean
  profit_target_rate: string
  profit_taking_rate: string
  vault_position_amount: string
  vault_position_amount_usd: string
  vault_position_unit: string
  vault_borrowing_amount: string
  vault_borrowing_amount_usd: string
  vault_borrowing_unit: string
  health_factor: string
  liquidation_price: string
  roi_amount: string
  roi_amount_usd: string
  roi_rate: string
  net_apy: string
}

export interface GetEarn {
  data: EarnData[];
}

export interface EarnData {
  symbol: string
  earn_vault_address: string
  owner_address: string
  lender_address: string
  tvl: string
  amount: string
  amount_usd: string
  deposit_amount: string
  deposit_amount_usd: string
  unit: string
  avg_index: string
  last_index: string
  vault_supply: string
  vault_supply_usd: string
  vault_supply_unit: string
  vault_borrow: string
  vault_borrow_usd: string
  vault_borrow_unit: string
  asset_to_vault_rate: string
  earning_amount: string
  earning_amount_usd: string
  earning_rate: string
  est_protocol_fee_amount: string
  est_protocol_fee_amount_usd: string
  token_address: string
}
