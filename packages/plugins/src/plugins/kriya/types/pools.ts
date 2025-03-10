import { ID } from '../../../utils/sui/types/id';
import { TickIndex, Type } from './common';

// Pool V2 Object Kriya

export type Pool = {
  id: ID;
  is_deposit_enabled: boolean;
  is_stable: boolean;
  is_swap_enabled: boolean;
  is_withdraw_enabled: boolean;
  lp_fee_percent: string;
  lsp_locked: string;
  lsp_supply: LspSupply;
  protocol_fee_percent: string;
  protocol_fee_x: string;
  protocol_fee_y: string;
  scaleX: string;
  scaleY: string;
  token_x: string;
  token_y: string;
};

export type ExtendedPool = Pool & {
  token_x_mint: string;
  token_y_mint: string;
};

export type LspSupply = {
  fields: Fields;
  type: string;
};

export type Fields = {
  value: string;
};

// LP Token V2 Object Kriya

export type LpTokenV2 = {
  id: ID;
  lsp: Lsp;
  pool_id: string;
};

export type Lsp = {
  fields: BalanceFields;
  type: string;
};

export type BalanceFields = {
  balance: string;
  id: ID;
};

// CLMM Position

export type ClmmPosition = {
  fee_growth_inside_x_last: string;
  fee_growth_inside_y_last: string;
  fee_rate: string;
  id: ID;
  liquidity: string;
  owed_coin_x: string;
  owed_coin_y: string;
  pool_id: string;
  reward_infos: PositionRewardInfo[];
  tick_lower_index: TickIndex;
  tick_upper_index: TickIndex;
  type_x: Type;
  type_y: Type;
};

export type PositionRewardInfo = {
  fields: PositionRewardInfoFields;
  type: string;
};

export type PositionRewardInfoFields = {
  coins_owed_reward: string;
  reward_growth_inside_last: string;
};

// CLMM Pool

export type ClmmPool = {
  fee_growth_global_x: string;
  fee_growth_global_y: string;
  flash_loan_fee_rate: string;
  id: ID;
  liquidity: string;
  max_liquidity_per_tick: string;
  observation_cardinality: string;
  observation_cardinality_next: string;
  observation_index: string;
  observations: Observation[];
  protocol_fee_share: string;
  protocol_fee_x: string;
  protocol_fee_y: string;
  protocol_flash_loan_fee_share: string;
  reserve_x: string;
  reserve_y: string;
  reward_infos: RewardInfo[];
  sqrt_price: string;
  swap_fee_rate: string;
  tick_bitmap: Tick;
  tick_index: TickIndex;
  tick_spacing: number;
  ticks: Tick;
  type_x: Type;
  type_y: Type;
};

export type RewardInfo = {
  fields: RewardInfoFields;
  type: string;
};

export type RewardInfoFields = {
  ended_at_seconds: string;
  last_update_time: string;
  reward_coin_type: Type;
  reward_growth_global: string;
  reward_per_seconds: string;
  total_reward: string;
  total_reward_allocated: string;
};

export type Observation = {
  fields: ObservationFields;
  type: string;
};

export type ObservationFields = {
  initialized: boolean;
  seconds_per_liquidity_cumulative: string;
  tick_cumulative: TickCumulative;
  timestamp_s: string;
};

export type TickCumulative = {
  fields: TickCumulativeFields;
  type: string;
};

export type TickCumulativeFields = {
  bits: string;
};

export type Tick = {
  fields: TickBitmapFields;
  type: string;
};

export type TickBitmapFields = {
  id: ID;
  size: string;
};

export type PoolStat = {
  poolId: string;
  volume24h: string;
  fees24h: string;
  tvl: string;
  apy: string;
};
