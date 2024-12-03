import BigNumber from 'bignumber.js';
import { ID } from '../../utils/sui/types/id';

export type PoolFields = {
  coin_a: string;
  coin_b: string;
  deploy_time_ms: string;
  fee: number;
  fee_growth_global_a: string;
  fee_growth_global_b: string;
  fee_protocol: number;
  id: { id: string };
  liquidity: string;
  max_liquidity_per_tick: string;
  protocol_fees_a: string;
  protocol_fees_b: string;
  reward_infos: {
    type: string;
    fields: {
      emissions_per_second: string;
      growth_global: string;
      id: ID;
      manager: string;
      vault: string;
      vault_coin_type: string;
    };
  }[];
  reward_last_updated_time_ms: string;
  sqrt_price: string;
  tick_current_index: Bits;
  tick_map: {
    type: string;
    fields: {
      id: { id: string };
      size: string;
    };
  };
  tick_spacing: number;
  unlocked: boolean;
};
export type Types = [string, string, string];

export type Bits = {
  type: string;
  fields: { bits: number };
};

export type Pool = PoolFields & {
  objectId: string;
  type: string;
  types: Types;
};

export type NFTFields = {
  coin_type_a: CoinType;
  coin_type_b: CoinType;
  description: string;
  fee_type: CoinType;
  id: { id: string };
  img_url: string;
  name: string;
  pool_id: string;
  position_id: string;
};

export type CoinType = {
  type: string;
  fields: {
    name: string;
  };
};

export type PositionFields = {
  fee_growth_inside_a: string;
  fee_growth_inside_b: string;
  id: { id: string };
  liquidity: string;
  reward_infos: {
    type: string;
    fields: {
      amount_owed: string;
      reward_growth_inside: string;
    };
  }[];
  tick_lower_index: Bits;
  tick_upper_index: Bits;
  tokens_owed_a: string;
  tokens_owed_b: string;
};

export type PositionTick = {
  tickIndex: number;
  initialized: boolean;
  liquidityNet: BigNumber;
  liquidityGross: BigNumber;
  feeGrowthOutsideA: BigNumber;
  feeGrowthOutsideB: BigNumber;
  rewardGrowthsOutside: [BigNumber, BigNumber, BigNumber];
};

export type VaultPositionNFT = {
  coin_a_type_name: CoinTypeName;
  coin_b_type_name: CoinTypeName;
  description: string;
  id: ID;
  index: string;
  name: string;
  strategy_id: string;
  url: string;
};

export type CoinTypeName = {
  fields: Fields;
  type: string;
};

export type Fields = {
  name: string;
};

export type VaultStrategy = {
  accounts: Accounts;
  base_tick_step_minimum: number;
  clmm_pool_id: string;
  coin_a_type_name: TypeName;
  coin_b_type_name: TypeName;
  default_base_rebalance_percentage: number;
  default_limit_rebalance_percentage: number;
  effective_tick_lower: EffectiveTick;
  effective_tick_upper: EffectiveTick;
  fee_type_name: TypeName;
  id: ID;
  image_url: string;
  limit_tick_step_minimum: number;
  management_fee_rate: string;
  performance_fee_rate: string;
  protocol_fees: Accounts;
  rewarders: any[];
  status: number;
  tick_spacing: number;
  total_share: string;
  vault_index: string;
  vaults: Vaults;
};

export type Accounts = {
  fields: AccountsFields;
  type: string;
};

export type AccountsFields = {
  id: ID;
  size: string;
};

export type TypeName = {
  fields: CoinATypeNameFields;
  type: string;
};

export type CoinATypeNameFields = {
  name: string;
};

export type EffectiveTick = {
  fields: EffectiveTickLowerFields;
  type: string;
};

export type EffectiveTickLowerFields = {
  bits: number;
};

export type Vaults = {
  fields: VaultsFields;
  type: string;
};

export type VaultsFields = {
  head: string;
  id: ID;
  size: string;
  tail: string;
};

export type VaultInfo = {
  id: ID;
  name: string;
  value: UsersInfo;
};

export type UsersInfo = {
  fields: UsersInfoPagination;
  type: string;
};

export type UsersInfoPagination = {
  next: null;
  prev: string;
  value: UserInfo;
};

export type UserInfo = {
  fields: UserPositionFields;
  type: string;
};

export type UserPositionFields = {
  base_clmm_position_id: string;
  base_last_tick_index: Index;
  base_liquidity: string;
  base_lower_index: Index;
  base_rebalance_threshold: number;
  base_tick_step: number;
  base_upper_index: Index;
  coin_a_type_name: CoinTypeName;
  coin_b_type_name: CoinTypeName;
  limit_clmm_position_id: string;
  limit_last_tick_index: Index;
  limit_liquidity: string;
  limit_lower_index: Index;
  limit_rebalance_threshold: number;
  limit_tick_step: number;
  limit_upper_index: Index;
  management_fee_rate: null;
  performance_fee_rate: null;
  rewards: Rewards;
  share: string;
  sqrt_price: string;
  strategy_id: string;
  vault_id: string;
};

export type Index = {
  fields: BaseLastTickIndexFields;
  type: string;
};

export type BaseLastTickIndexFields = {
  bits: number;
};

export type Rewards = {
  fields: RewardsFields;
  type: string;
};

export type RewardsFields = {
  contents: any[];
};
