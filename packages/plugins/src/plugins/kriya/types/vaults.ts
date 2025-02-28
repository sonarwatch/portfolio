import { ID } from '../../../utils/sui/types/id';
import { RewardInfo, TickIndex, Type } from './common';

// Vault

export type Vault = {
  clmm_pool_id: string;
  fee_a: string;
  fee_b: string;
  fee_val: string;
  free_balance_a: string;
  free_balance_b: string;
  free_threshold_a: string;
  free_threshold_b: string;
  id: ID;
  last_rebalance_sqrt_price: string;
  last_rebalance_time: string;
  lower_price_scalling: string;
  lower_tick: number;
  lower_trigger_price: string;
  lower_trigger_price_scalling: string;
  rewards_bag: RewardsBag;
  seed_balance: string;
  slippage_down: string;
  slippage_up: string;
  swap_routes: RewardsBag;
  treasury_cap: TreasuryCap;
  upper_price_scalling: string;
  upper_tick: number;
  upper_trigger_price: string;
  upper_trigger_price_scalling: string;
};

export type RewardsBag = {
  fields: RewardsBagFields;
  type: string;
};

export type RewardsBagFields = {
  id: ID;
  size: string;
};

export type TreasuryCap = {
  fields: TreasuryCapFields;
  type: string;
};

export type TreasuryCapFields = {
  id: ID;
  total_supply: TotalSupply;
};

export type TotalSupply = {
  fields: TotalSupplyFields;
  type: string;
};

export type TotalSupplyFields = {
  value: string;
};

// Cetus Vault Position

export type VaultPositionCetus = {
  id: ID;
  name: number[];
  value: ValueCetus;
};

export type ValueCetus = {
  fields: PositionFieldsCetus;
  type: string;
};

export type PositionFieldsCetus = {
  coin_type_a: CoinType;
  coin_type_b: CoinType;
  description: string;
  id: ID;
  index: string;
  liquidity: string;
  name: string;
  pool: string;
  tick_lower_index: TickIndex;
  tick_upper_index: TickIndex;
  url: string;
};

export type CoinType = {
  fields: CoinTypeAFields;
  type: string;
};

export type CoinTypeAFields = {
  name: string;
};

// Kriya Vault Position

export type VaultPositionKriya = {
  id: ID;
  name: number[];
  value: ValueKriya;
};

export type ValueKriya = {
  fields: PositionFieldsKriya;
  type: string;
};

export type PositionFieldsKriya = {
  fee_growth_inside_x_last: string;
  fee_growth_inside_y_last: string;
  fee_rate: string;
  id: ID;
  liquidity: string;
  owed_coin_x: string;
  owed_coin_y: string;
  pool_id: string;
  reward_infos: RewardInfo[];
  tick_lower_index: TickIndex;
  tick_upper_index: TickIndex;
  type_x: Type;
  type_y: Type;
};

// Leverage Vault

export type LeverageVaultInfo = {
  depositedA: string;
  apr: string;
  borrowedBUsd: string;
  farm: {
    id: string;
    vtType: string;
  };
  decimalA: string;
  createdAt: string;
  coinB: string;
  decimalB: string;
  tvl: string;
  borrowedB: string;
  targetLeverage: string;
  vaultName: string;
  depositedAUsd: string;
  lpSupply: string;
  vaultSource: string;
  fees: string;
  coinA: string;
  updatedAt: string;
  vaultId: string;
};

// Vault dynamic field object of the position

export type DynFieldPositionVault = {
  name: Name;
  bcsName: string;
  type: string;
  objectType: string;
  objectId: string;
  version: number;
  digest: string;
};

export type Name = {
  type: string;
  value: number[];
};

// Receipt

export type StakeReceiptWithPoints = {
  farm_id: string;
  id: ID;
  rewards_stake_receipt: {
    fields: {
      farm_id: string;
      id: ID;
      reward_infos: {
        fields: {
          id: ID;
          size: string;
        };
        type: string;
      };
      shares: string;
    };
    type: string;
  };
  user_points_info: {
    fields: {
      claimed_points: string;
      index: string;
      updated_at: string;
    };
    type: string;
  };
};

export type VaultReceipt = {
  farm_id: string;
  id: ID;
  reward_infos: RewardInfos;
  shares: string;
  user_points_info: UserPointsInfo;
};

export type RewardInfos = {
  fields: RewardInfosFields;
  type: string;
};

export type RewardInfosFields = {
  id: ID;
  size: string;
};

export type UserPointsInfo = {
  fields: UserPointsInfoFields;
  type: string;
};

export type UserPointsInfoFields = {
  claimed_points: string;
  index: string;
  updated_at: string;
};

// API Data

export type VaultDataOld = {
  lpPriceHigh: string;
  apr: string;
  createdAt: Date;
  coinB: string;
  tvl: string;
  vaultName: string;
  lastRebalance: string;
  lpSupply: string;
  vaultSource: string;
  farmId: string;
  fees: string;
  coinA: string;
  lpPriceLow: string;
  updatedAt: Date;
  currentLpPrice: string;
  id: string;
  rebalanceCap: string;
  pool: PoolOld;
};

export type PoolOld = {
  tokenYDecimals: number;
  vaultCoinType: string;
  vaultType: string;
  tokenXType: string;
  tokenYType: string;
  poolId: string;
  tokenXDecimals: number;
};

export type APIResponseVault = {
  status: number;
  message: string;
  data: VaultData[];
  timestamp: Date;
};

export type VaultData = {
  vaultId: string;
  vaultType: string;
  vaultName: string;
  vaultSource: string;
  vtType: string;
  performanceFee: string;
  withdrawalFee: string;
  info: Info;
  stats: Stats;
  farm: Farm | null;
};

export type Farm = {
  id: string;
  vaultId: string;
  rewardTypes: string[];
  apr: string;
  isActive: boolean;
  vtType: string;
};

export type Info = {
  pool?: Pool;
  type?: string;
  adapter?: string;
  lpPriceLow?: string;
  lpPriceHigh?: string;
  depositLimit: string;
  tokenXAmount?: string;
  tokenYAmount?: string;
  lastRebalance?: string;
  currentLpPrice?: string;
  depositLimitUsd: string;
  depositedX?: number;
  tokenXType?: string;
  depositedXUsd?: number;
  aumInBaseToken?: number;
  targetLeverage?: number;
  tokenXDecimals?: number;
  borrowedY?: number;
  tokenYType?: string;
  borrowedYUsd?: number;
  legacyFarmId?: string;
  tokenYDecimals?: number;
  legacyStakeReceiptType?: string;
};

export type Pool = {
  poolId: string;
  tokenXType: string;
  tokenYType: string;
  tokenXDecimals: number;
  tokenYDecimals: number;
  poolTickSpacing: number;
};

export type Stats = {
  vaultId: string;
  vtSupply: string;
  apr: string;
  tvl: string;
  timestamp: Date;
};
