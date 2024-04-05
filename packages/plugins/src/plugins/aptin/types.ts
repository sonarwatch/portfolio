export type PoolPositions = {
  borrow_coins: string[];
  borrow_position: {
    handle: string;
  };
  registered: boolean;
  slot: string;
  supply_coins: string[];
  supply_position: {
    handle: string;
  };
};

export type SupplyPosition = {
  amount: string;
  collateral: boolean;
  index_interest: string;
  interest: string;
  last_update_time_interest: string;
  last_update_time_reward: string;
  reserve1: string;
  reserve2: string;
  reserve3: string;
  reserve4: string;
  reward: string;
};

export type BorrowPosition = {
  amount: string;
  index_interest: string;
  interest: string;
  last_update_time_interest: string;
  last_update_time_reward: string;
  reserve1: string;
  reserve2: string;
  reserve3: string;
  reserve4: string;
  reward: string;
};

// Config
export type PoolsConfig = {
  poolHandle: string;
  priceHandle: string;
  configStores: ConfigStore[];
  borrow_interest_rateVals: BorrowInterestRateVal[];
  rewardHandle: string;
  rewardTokenStart: RewardTokenStart[];
  coins: string[];
};

export type BorrowInterestRateVal = {
  a: string;
  b: string;
  c: string;
  ct: string;
  d: string;
  k: string;
  reserves: string;
};
export type ConfigStores = Record<
  string,
  ConfigStore & {
    decimals: number;
  }
>;

export type ConfigStore = {
  coin_name: string;
  fees: number;
  ltv: number;
  max_deposit_limit: string;
  min_deposit_limit: string;
  weight: number;
};

export type RewardTokenStart = {
  coin_name: string;
  start: boolean;
};
