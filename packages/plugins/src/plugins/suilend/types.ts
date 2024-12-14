import { BorrowLendRate } from '@sonarwatch/portfolio-core';
import { ParsedData } from '../../utils/sui/types';
import { ID } from '../../utils/sui/types/id';

export type ObligationCapFields = {
  id: ID;
  obligation_id: string;
};

export type Obligation = {
  id: ID;
  lending_market_id: string;
  deposits: ParsedData<Deposit>[];
  borrows: ParsedData<Borrow>[];
  deposited_value_usd: ParsedData<Value>;
  allowed_borrow_value_usd: ParsedData<Value>;
  unhealthy_borrow_value_usd: ParsedData<Value>;
  super_unhealthy_borrow_value_usd: ParsedData<Value>;
  unweighted_borrowed_value_usd: ParsedData<Value>;
  weighted_borrowed_value_usd: ParsedData<Value>;
  weighted_borrowed_value_upper_bound_usd: ParsedData<Value>;
  borrowing_isolated_asset: boolean;
  user_reward_managers: ParsedData<UserRewardManager>[];
  bad_debt_usd: ParsedData<Value>;
  closable: boolean;
};

export type Deposit = {
  attributed_borrow_value: ParsedData<Value>;
  coin_type: ParsedData<Name>;
  deposited_ctoken_amount: string;
  market_value: ParsedData<Value>;
  user_reward_manager_index: string;
  reserve_array_index: string;
};

export type Borrow = {
  coin_type: ParsedData<Name>;
  borrowed_amount: ParsedData<Value>;
  cumulative_borrow_rate: ParsedData<Value>;
  market_value: ParsedData<Value>;
  user_reward_manager_index: string;
  reserve_array_index: string;
};

export type UserRewardManager = {
  last_update_time_ms: string;
  pool_reward_manager_id: string;
  rewards: ParsedData<Reward>[];
  share: string;
};

export type Reward = {
  cumulative_rewards_per_share: ParsedData<Value>;
  earned_rewards: ParsedData<Value>;
  pool_reward_id: string;
};

export type MarketsInfo = {
  lendingMarkets: LendingMarket[];
  rates: BorrowLendRate[];
};

export type LendingMarket = {
  id: ID;
  version: string;
  fee_receiver: string;
  reserves: ParsedData<Reserve>[];
};

export type Reserve = {
  id: ID;
  array_index: string;
  attributed_borrow_value: ParsedData<Value>;
  available_amount: string;
  borrowed_amount: ParsedData<Value>;
  borrows_pool_reward_manager: ParsedData<PoolRewardManager>;
  coin_type: ParsedData<Name>;
  config: ParsedData<Config>;
  ctoken_supply: string;
  cumulative_borrow_rate: ParsedData<Value>;
  deposits_pool_reward_manager: ParsedData<PoolRewardManager>;
  interest_last_update_timestamp_s: string;
  lending_market_id: string;
  mint_decimals: number;
  price: ParsedData<Value>;
  price_identifier: ParsedData<PriceIdentifier>;
  price_last_update_timestamp_s: string;
  smoothed_price: ParsedData<Value>;
  unclaimed_spread_fees: ParsedData<Value>;
};

export type PoolRewardManager = {
  id: ID;
  last_update_time_ms: string;
  pool_rewards: ParsedData<PoolReward>[];
  total_shares: string;
};

export type PoolReward = null | {
  id: ID;
  additional_fields: ParsedData<AdditionalFields>;
  allocated_rewards: ParsedData<Value>;
  coin_type: ParsedData<Name>;
  cumulative_rewards_per_share: ParsedData<Value>;
  end_time_ms: string;
  num_user_reward_managers: string;
  pool_reward_manager_id: string;
  start_time_ms: string;
  total_rewards: string;
};

export type AdditionalFields = {
  id: ID;
  size: string;
};

export type Config = {
  element: ParsedData<Element>;
};

export type Element = {
  additional_fields: ParsedData<AdditionalFields>;
  borrow_fee_bps: string;
  borrow_limit: string;
  borrow_limit_usd: string;
  borrow_weight_bps: string;
  close_attributed_borrow_limit_usd: string;
  close_ltv_pct: number;
  deposit_limit: string;
  deposit_limit_usd: string;
  interest_rate_aprs: string[];
  interest_rate_utils: number[];
  isolated: boolean;
  liquidation_bonus_bps: string;
  max_close_ltv_pct: number;
  max_liquidation_bonus_bps: string;
  open_attributed_borrow_limit_usd: string;
  open_ltv_pct: number;
  protocol_liquidation_fee_bps: string;
  spread_fee_bps: string;
};

export type PriceIdentifier = {
  bytes: number[];
};

export type Value = {
  value: string;
};
export type Name = {
  name: string;
};

export type RewardInfo = { poolId: string; rewardMint: string };

export type SuilendCapsule = {
  id: ID;
  rarity: 'rare' | 'common' | 'uncommon';
};

export type BurnEvents = {
  pointsRecord: Record<string, number>;
  capsuleRecord: Record<string, number>;
};

export type BurnEvent = {
  id: EventId;
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: BurnEventJSON;
  bcs: string;
};

export type EventId = {
  txDigest: string;
  eventSeq: string;
};

export type BurnEventJSON = {
  claim_amount: string;
  manager_id: string;
  points_burned?: string;
  rarity?: string;
};
