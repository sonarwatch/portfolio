import BigNumber from 'bignumber.js';

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
      id: {
        id: string;
      };
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
