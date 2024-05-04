export type VaultInfo = {
  id: string;
  underlyingPool: string;
  tokenType: string;
};

export type Vault = {
  clmm_pool_id: string;
  fee_a: string;
  fee_b: string;
  fee_val: string;
  free_balance_a: string;
  free_balance_b: string;
  free_threshold_a: string;
  free_threshold_b: string;
  id: ID;
  last_rebalance_sqrt_price: string;
  last_rebalance_time: string;
  lower_price_scalling: string;
  lower_tick: number;
  lower_trigger_price: string;
  lower_trigger_price_scalling: string;
  rewards_bag: RewardsBag;
  seed_balance: string;
  slippage_down: string;
  slippage_up: string;
  swap_routes: RewardsBag;
  treasury_cap: TreasuryCap;
  upper_price_scalling: string;
  upper_tick: number;
  upper_trigger_price: string;
  upper_trigger_price_scalling: string;
};

export type ID = {
  id: string;
};

export type RewardsBag = {
  fields: RewardsBagFields;
  type: string;
};

export type RewardsBagFields = {
  id: ID;
  size: string;
};

export type TreasuryCap = {
  fields: TreasuryCapFields;
  type: string;
};

export type TreasuryCapFields = {
  id: ID;
  total_supply: TotalSupply;
};

export type TotalSupply = {
  fields: TotalSupplyFields;
  type: string;
};

export type TotalSupplyFields = {
  value: string;
};

export type VaultPositionInfo = {
  id: string;
  lowerTick: number;
  upperTick: number;
  liquidity: string;
  totalSupply: string;
};

export type VaultPosition = {
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

export type FarmInfo = {
  tokenXReserve: string;
  lspSupply: string;
  protocolFeesPercent: string;
  createdAt: Date;
  farmSource: FarmSource;
  volume: number;
  packageId: string;
  farmId: string;
  objectId: string;
  poolSource: PoolSource;
  lspType: string;
  lpFeesPercent: string;
  tokenYType: string;
  data: string;
  updatedAt: Date;
  isStable: boolean;
  tokenXType: string;
  tokenYReserve: string;
  tokenX: Token;
  tokenY: Token;
  tvl: number;
  apy: number;
  feeApy: number;
};

export enum FarmSource {
  Buck = 'buck',
  Empty = '',
  Kriya = 'kriya',
}

export enum PoolSource {
  Deepbook = 'deepbook',
  DeepbookV2 = 'deepbook_v2',
  Kriya = 'kriya',
}

export type Token = {
  coinType: string;
  ticker: string;
  tokenName: string;
  updatedAt: Date;
  createdAt: Date;
  decimals: number;
  iconUrl: string;
  description: string;
  price: string;
};

export type LiquidityPosition = {
  farm_id: string;
  id: ID;
  lock_until: string;
  stake_amount: string;
  stake_weight: string;
  start_unit: string;
};
