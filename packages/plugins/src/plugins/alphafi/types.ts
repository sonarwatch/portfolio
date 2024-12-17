import BigNumber from 'bignumber.js';
import { ID } from '../../utils/sui/types/id';

export type Receipt = {
  id: {
    id: string;
  };
  image_url: string;
  last_acc_reward_per_xtoken: {
    fields: {
      contents: {
        fields: {
          key: {
            fields: {
              name: string;
            };
            type: string;
          };
          value: string;
        };
        type: string;
      }[];
      type: string;
    };
  };
  locked_balance: {
    fields: {
      head: string;
      id: {
        id: string;
      };
      size: string;
      tail: string;
    };
  };
  name: string;
  owner: string;
  pending_rewards: {
    fields: {
      contents: {
        fields: {
          key: {
            fields: {
              name: string;
            };
            type: string;
          };
          value: string;
        };
        type: string;
      }[];
      type: string;
    };
  };
  pool_id: string;
  unlocked_xtokens: string;
  xTokenBalance: string;
};

export type AlphaPool = {
  acc_rewards_per_xtoken: {
    fields: {
      contents: {
        key: {
          fields: {
            name: string;
          };
          type: string;
        };
        value: string;
        type: string;
      }[];
    };
    type: string;
  };
  alpha_bal: string;
  deposit_fee: string;
  deposit_fee_max_cap: string;
  id: {
    id: string;
  };
  image_url: number[]; // Array of numbers (ASCII values)
  instant_withdraw_fee: string;
  instant_withdraw_fee_max_cap: string;
  locked_period_in_ms: string;
  locking_start_ms: string;
  name: number[]; // Array of numbers (ASCII values)
  paused: boolean;
  performance_fee: string;
  performance_fee_max_cap: string;
  rewards: {
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
    type: string;
  };
  tokensInvested: string;
  withdraw_fee_max_cap: string;
  withdrawal_fee: string;
  xTokenSupply: string;
};

export type Investor = {
  emergency_balance_a: string;
  emergency_balance_b: string;
  free_balance_a: string;
  free_balance_b: string;
  free_rewards: FreeRewards;
  id: ID;
  is_emergency: boolean;
  lower_tick: number;
  minimum_swap_amount: string;
  performance_fee: string;
  performance_fee_max_cap: string;
  upper_tick: number;
};

export type FreeRewards = {
  fields: Fields;
  type: string;
};

export type Fields = {
  id: ID;
  size: string;
};

export type AlphaPoolInfo = {
  tokenAmountA: BigNumber;
  tokenAmountB?: BigNumber;
  coinTypeA: string;
  coinTypeB?: string;
  alphaPoolId: string;
  underlyingPoolId?: string;
  xTokenSupply: BigNumber;
  tokensInvested: BigNumber;
  unlockAt?: number;
  protocol: 'NAVI' | 'ALPHAFI' | 'CETUS' | 'BLUEFIN' | 'BUCKET';
};

export type CetusPosition = {
  id: ID;
  name: number[];
  value: Value;
};
export type Value = {
  fields: ValueFields;
  type: string;
};

export type ValueFields = {
  coin_type_a: CoinType;
  coin_type_b: CoinType;
  description: string;
  id: ID;
  index: string;
  liquidity: string;
  name: string;
  pool: string;
  tick_lower_index: TickErIndex;
  tick_upper_index: TickErIndex;
  url: string;
};

export type CoinType = {
  fields: CoinTypeAFields;
  type: string;
};

export type CoinTypeAFields = {
  name: string;
};

export type TickErIndex = {
  fields: TickLowerIndexFields;
  type: string;
};

export type TickLowerIndexFields = {
  bits: number;
};

export type AlphaVault = {
  acc_rewards_per_xtoken: AccRewardsPerXtoken;
  alpha_bal: string;
  deposit_fee: string;
  deposit_fee_max_cap: string;
  id: ID;
  image_url: number[];
  instant_withdraw_fee: string;
  instant_withdraw_fee_max_cap: string;
  locked_period_in_ms: string;
  locking_start_ms: string;
  name: number[];
  paused: boolean;
  performance_fee: string;
  performance_fee_max_cap: string;
  rewards: Rewards;
  tokensInvested: string;
  withdraw_fee_max_cap: string;
  withdrawal_fee: string;
  xTokenSupply: string;
};

export type AccRewardsPerXtoken = {
  fields: AccRewardsPerXtokenFields;
  type: string;
};

export type AccRewardsPerXtokenFields = {
  contents: Content[];
};

export type Content = {
  fields: ContentFields;
  type: string;
};

export type ContentFields = {
  key: Key;
  value: string;
};

export type Key = {
  fields: KeyFields;
  type: string;
};

export type KeyFields = {
  name: string;
};

export type Rewards = {
  fields: RewardsFields;
  type: string;
};

export type RewardsFields = {
  id: ID;
  size: string;
};
