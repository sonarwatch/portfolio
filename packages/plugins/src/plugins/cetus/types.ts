import BigNumber from 'bignumber.js';
import { ID } from '../../utils/sui/types/id';

export type SuiAddressType = string;
export type SuiObjectIdType = string;

export type CoinPairType = {
  coinTypeA: SuiAddressType;
  coinTypeB: SuiAddressType;
};

export type PoolImmutables = {
  poolAddress: string;
  tickSpacing: string;
} & CoinPairType;

export type Pool = {
  poolType: string;
  coinAmountA: number;
  coinAmountB: number;
  current_sqrt_price: number;
  current_tick_index: number;
  fee_growth_global_b: number;
  fee_growth_global_a: number;
  fee_protocol_coin_a: number;
  fee_protocol_coin_b: number;
  fee_rate: number;
  is_pause: boolean;
  liquidity: number;
  index: number;
  position_manager: {
    positions_handle: string;
    size: number;
  };
  rewarder_infos: Array<Rewarder>;
  rewarder_last_updated_time: string;
  ticks_handle: string;
  uri: string;
  name: string;
} & PoolImmutables;

export type PoolStat = {
  vol_in_usd?: string;
  vol_in_usd_24h?: string;
  apr_24h?: string;
  apr_7day?: string;
  apr_30day?: string;
};

export type SuiStructTag = {
  full_address: string;
  source_address: string;
  address: SuiAddressType;
  module: string;
  name: string;
  type_arguments: SuiAddressType[];
};

export type Rewarder = {
  coinAddress: string;
  emissions_per_second: number;
  growth_global: number;
  emissionsEveryDay: number;
};

export enum ClmmPositionStatus {
  'Deleted' = 'Deleted',
  'Exists' = 'Exists',
  'NotExists' = 'NotExists',
}

export type NFT = {
  creator: string;
  description: string;
  image_url: string;
  link: string;
  name: string;
  project_url: string;
};

export type Position = {
  pos_object_id: SuiObjectIdType;
  owner: SuiObjectIdType;
  pool: SuiObjectIdType;
  type: SuiAddressType;
  coin_type_a: SuiAddressType;
  coin_type_b: SuiAddressType;
  index: number;
  liquidity: string;
  tick_lower_index: number;
  tick_upper_index: number;
  position_status: ClmmPositionStatus;
} & NFT &
  PositionReward;

export type PositionReward = {
  pos_object_id: SuiObjectIdType;
  liquidity: string;
  tick_lower_index: number;
  tick_upper_index: number;
  fee_growth_inside_a: string;
  fee_owed_a: string;
  fee_growth_inside_b: string;
  fee_owed_b: string;
  reward_amount_owed_0: string;
  reward_amount_owed_1: string;
  reward_amount_owed_2: string;
  reward_growth_inside_0: string;
  reward_growth_inside_1: string;
  reward_growth_inside_2: string;
};

export type ParsedJsonEvent = {
  coin_type_a: string;
  coin_type_b: string;
  pool_id: string;
  tick_spacing: number;
};

export type TablePoolInfo = {
  id: ID;
  name: string;
  value: TablePoolInfoValue;
};

export type TablePoolInfoValue = {
  fields: TableFields;
  type: string;
};

export type TableFields = {
  next: string;
  prev: string;
  value: PoolValue;
};

export type PoolValue = {
  fields: PoolFields;
  type: string;
};

export type PoolFields = {
  coin_type_a: CoinType;
  coin_type_b: CoinType;
  pool_id: string;
  pool_key: string;
  tick_spacing: number;
};

export type CoinType = {
  fields: CoinTypeFields;
  type: string;
};

export type CoinTypeFields = {
  name: string;
};

export type Vault = {
  id: ID;
  pool: string;
  liquidity: string;
  lp_token_treasury: {
    fields: {
      id: ID;
      total_supply: {
        fields: {
          value: string;
        };
        type: string;
      };
    };
    type: string;
  };
  positions: {
    fields: WrappedPositionNFT;
    type: string;
  }[];
};

export type LpPosition = {
  fields: {
    coin_type_a: {
      fields: {
        name: string;
      };
      type: string;
    };
    coin_type_b: {
      fields: {
        name: string;
      };
      type: string;
    };
    description: string;
    id: ID;
    index: number;
    liquidity: string;
    name: string;
    pool: SuiObjectIdType;
    tick_lower_index: {
      fields: {
        bits: number;
      };
      type: string;
    };
    tick_upper_index: {
      fields: {
        bits: number;
      };
      type: string;
    };
    url: string;
  };
  type: string;
};

export type WrappedPositionNFT = {
  clmm_postion: LpPosition;
  id: ID;
  pool_id: string;
  url: string;
};

export type VaultToPoolMapItem = {
  id: ID;
  name: string;
  value: string;
};

export type Farm = {
  clmm_pool_id: string;
  effective_tick_lower: {
    fields: {
      bits: number;
    };
    type: string;
  };
  effective_tick_upper: {
    fields: {
      bits: number;
    };
    type: string;
  };
  id: ID;
  rewarders: {
    fields: {
      name: string;
    };
    type: string;
  }[];
  sqrt_price: string;
  total_share: string;
};

export type LimitOrder = {
  canceled_ts: string;
  claimed_amount: string;
  created_ts: string;
  expire_ts: string;
  id: ID;
  obtained_amount: string;
  owner: string;
  pay_balance: string;
  rate: string;
  rate_order_indexer_id: string;
  target_balance: string;
  total_pay_amount: string;
};

export type DcaOrder = {
  amount_left_next_cycle: string;
  created_at: string;
  cycle_frequency: string;
  fee_rate: string;
  id: ID;
  in_amount_per_cycle: string;
  in_balance: string;
  in_deposited: string;
  in_withdrawn: string;
  max_out_amount_per_cycle: string;
  min_out_amount_per_cycle: string;
  next_cycle_at: string;
  out_balance: string;
  out_withdrawn: string;
  status: string;
  user: string;
};

export type FetchPosFeeParams = {
  poolAddress: string;
  positionId: string;
  coinTypeA: string;
  coinTypeB: string;
};

export type CollectFeesQuote = {
  position_id: string;
  feeOwedA: BigNumber;
  feeOwedB: BigNumber;
};

export type FetchPosRewardParams = {
  poolAddress: string;
  positionId: string;
  coinTypeA: string;
  coinTypeB: string;
  rewarderInfo: Rewarder[];
};

export type RewarderAmountOwed = {
  amount_owed: BigNumber;
  coin_address: string;
};

export type PosRewarderResult = {
  poolAddress: string;
  positionId: string;
  rewarderAmountOwed: RewarderAmountOwed[];
};

export type CetusPool = {
  coin_a: string;
  coin_b: string;
  current_sqrt_price: string;
  current_tick_index: CurrentTickIndex;
  fee_growth_global_a: string;
  fee_growth_global_b: string;
  fee_protocol_coin_a: string;
  fee_protocol_coin_b: string;
  fee_rate: string;
  id: ID;
  index: string;
  is_pause: boolean;
  liquidity: string;
  position_manager: PositionManager;
  rewarder_manager: RewarderManager;
  tick_manager: TickManager;
  tick_spacing: number;
  url: string;
};

export type CurrentTickIndex = {
  fields: CurrentTickIndexFields;
  type: string;
};

export type CurrentTickIndexFields = {
  bits: number;
};

export type PositionManager = {
  fields: PositionManagerFields;
  type: string;
};

export type PositionManagerFields = {
  position_index: string;
  positions: Positions;
  tick_spacing: number;
};

export type Positions = {
  fields: PositionsFields;
  type: string;
};

export type PositionsFields = {
  head: string;
  id: ID;
  size: string;
  tail: string;
};

export type RewarderManager = {
  fields: RewarderManagerFields;
  type: string;
};

export type RewarderManagerFields = {
  last_updated_time: string;
  points_growth_global: string;
  points_released: string;
  rewarders: RewarderInfo[];
};

export type RewarderInfo = {
  fields: RewarderFields;
  type: string;
};

export type RewarderFields = {
  emissions_per_second: string;
  growth_global: string;
  reward_coin: RewardCoin;
};

export type RewardCoin = {
  fields: RewardCoinFields;
  type: string;
};

export type RewardCoinFields = {
  name: string;
};

export type TickManager = {
  fields: TickManagerFields;
  type: string;
};

export type TickManagerFields = {
  tick_spacing: number;
  ticks: Ticks;
};

export type Ticks = {
  fields: TicksFields;
  type: string;
};

export type TicksFields = {
  head: Tail[];
  id: ID;
  level: string;
  list_p: string;
  max_level: string;
  random: Random;
  size: string;
  tail: Tail;
};

export type Tail = {
  fields: TailFields;
  type: string;
};

export type TailFields = {
  is_none: boolean;
  v: string;
};

export type Random = {
  fields: RandomFields;
  type: string;
};

export type RandomFields = {
  seed: string;
};
