export type Position = {
  pool: string;
  owner: string;
  reward_before_deposit: string;
  reward_earned: string;
  reward_claimed: string;
  amount: string;
  deactivating_amount: string;
  claiming_amount: string;
  last_updated_epoch_index: string;
};

export type Pool = {
  liquidity_mint: string;
  liquidity_holder: string;
  per_token_amount: string;
  max_deposit_amount: string;
  min_deposit_amount: string;
  max_supply: string;
  current_supply: string;
  next_supply: string;
  reward_per_token: string;
  reward_annual_rate: string;
  deactivating_amount_n0: string;
  claiming_amount_n0: string;
  deactivating_amount_n1: string;
  claiming_amount_n1: string;
  pending_amount: string;
  epoch_duration: string;
  epoch_index: string;
  epoch_start_time: string;
  authority_bump: string;
  admin: string;
  pending_admin?: string;
};

export type CachedPool = Pool & {
  pubkey: string;
};
