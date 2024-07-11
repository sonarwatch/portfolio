export type UserVault = {
  collaterals: {
    data: Collateral[];
  };
  efficiency_mode_id: number;
  liabilities: {
    data: Liability[];
  };
};

export type Collateral = {
  key: {
    inner: string;
  };
  value: string;
};

export type Liability = {
  key: {
    inner: string;
  };
  value: {
    interest_accumulated: string;
    last_interest_rate_index: {
      v: string;
    };
    principal: string;
  };
};

export type Market = {
  market: string;
  asset_name: string;
  supplyApr: number;
  borrowApr: number;
  coinType: string;
  collateralFactor: number;
};

export type LendingMarket = {
  asset_mantissa: string;
  asset_name: string;
  asset_type: string;
  borrow_cap: string;
  collateral_factor_bps: string;
  efficiency_mode_id: number;
  initial_liquidity: string;
  interest_rate_last_update_seconds: string;
  interest_rate_model_type: string;
  paused: boolean;
  supply_cap: string;
  total_cash: string;
  total_liability: string;
  total_reserve: string;
  total_shares: string;
};

export type UserStaker = {
  user_pools: {
    data: UserPool[];
  };
};

export type UserPool = {
  key: string;
  value: {
    farming_identifier: string;
    rewards: {
      data: Reward[];
    };
  };
};

export type Reward = {
  key: string;
  value: {
    last_acc_rewards_per_share: string;
    reward_amount: string;
    reward_name: string;
  };
};

export type RewardBalance = {
  coinType: string;
  balance: number;
};
