export interface Vault {
  id: string;
  depositToken: string;
  rewardToken: string[];
  info: Info;
  config: Config;
  shareSupply: ShareSupply;
  u64Padding: string[];
  bcsPadding: string[];
}

export interface Info {
  index: string;
  round: string;
  portfolio_vault_index: string;
  refresh_ts_ms: string;
  status: string;
  lending_enabled: string;
  price_mbp: string;
  mbp_incentivised: string;
  fixed_incentivised: string;
  token_decimal: string;
  lending_apr_mbp: string;
  creation_ts_ms: string;
}

export interface Config {
  capacity: string;
  lot_size: string;
  min_size: string;
  fee_bp: string;
  utilization_rate_bp: string;
  point_per_hour_bp: string;
  incentive_mbp: string;
  incentive_fixed: string;
}

export interface ShareSupply {
  active_share: string;
  deactivating_share: string;
  inactive_share: string;
  warmup_share: string;
  snapshot_share: string;
  reward_share: string[];
}

export interface TypusBidReceipt {
  id: string;
  vid: string;
  index: string;
  metadata: string;
  u64_padding: string[];
}

export interface Share {
  user: string;
  share: ShareSupply;
  u64Padding: string[];
  bcsPadding: string[];
}
