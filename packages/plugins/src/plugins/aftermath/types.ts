import { ID } from '../../utils/sui/types/id';

export type Pool = {
  id: { id: string };
  name: string;
  value: string;
};

export type PoolInfo = {
  coin_decimals: number[];
  creator: string;
  decimal_scalars: string[];
  fees_deposit: string[];
  fees_swap_in: string[];
  fees_swap_out: string[];
  fees_withdraw: string[];
  flatness: string;
  id: ID;
  illiquid_lp_supply: string;
  lp_decimal_scalar: string;
  lp_decimals: number;
  lp_supply: {
    type: string;
    fields: { value: string };
  };
  name: string;
  normalized_balances: string[];
  type_names: string[];
  weights: string[];
};

export type StakingPosition = {
  afterburner_vault_id: string;
  balance: string;
  base_rewards_accumulated: string[];
  base_rewards_debt: string[];
  id: ID;
  last_reward_timestamp_ms: string;
  lock_duration_ms: string;
  lock_multiplier: string;
  lock_start_timestamp_ms: string;
  multiplier_rewards_accumulated: string[];
  multiplier_rewards_debt: string[];
  multiplier_staked_amount: string;
};

export type PoolFactory = {
  id: { id: string };
  name: string;
  value: string;
};

export type BurnerVault = {
  id: ID;
  emission_rates: string[];
  type_names: string[];
  rewards: string[];
};

export type CoinType = string;

export type HarvestedRewards = {
  afterburner_vault_id: string;
  reward_amounts: string[];
  reward_types: string[];
};
