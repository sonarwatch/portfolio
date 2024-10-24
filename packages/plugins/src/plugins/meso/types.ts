export type UserPosition = {
  debt_shares: ShareData;
  deposit_shares: ShareData;
  emode_id: string;
};

export type ShareData = {
  data: ShareInfo[];
};

export type ShareInfo = {
  key: Key;
  value: string;
};

export type Key = {
  inner: string;
};

export type LendingPool = {
  borrow_rewards_pool: BorrowRewardsPool;
  emode_id: string;
  extend_ref: ExtendRef;
  fungible_asset: BorrowRewardsPool;
  supply_rewards_pool: BorrowRewardsPool;
  token: string;
};

export type BorrowRewardsPool = {
  inner: string;
};

export type ExtendRef = {
  self: string;
};

export type PoolApiResponse = {
  datas: Pool[];
  total: number;
  totalPages: number;
};

export type Pool = {
  _id: string;
  poolAddress: string;
  __v: number;
  baseBps: number;
  borrowApy: number;
  borrowCap: number;
  borrowFeeBps: number;
  borrowRewardsPool: string;
  closeFactorBps: number;
  createdAt: Date;
  emodeBps: number;
  emodeId: string;
  emodeLiquidationThresholdBps: number;
  fungibleAsset: string;
  incentiveBorrowApy: number;
  incentiveSupplyApy: number;
  isPaused: boolean;
  liquidationFeeBps: number;
  liquidationThresholdBps: number;
  maxBps: number;
  normaBps: number;
  optimalBps: number;
  optimalUtilizationBps: number;
  poolSupply: number;
  protocolInterestFeeBps: number;
  protocolLiquidationFeeBps: number;
  supplyApy: number;
  supplyCap: number;
  supplyRewardsPool: string;
  token: Token;
  tokenAddress: string;
  totalDebt: number;
  totalDebtShares: number;
  totalFees: number;
  totalReserves: number;
  totalSupplyShares: number;
  updatedAt: Date;
  stakingApr: number;
  orderValue?: number;
};

export type Token = {
  _id: string;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  type: Type;
  wrapAddress: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  price: number;
  icon_uri?: string;
  project_uri?: string;
};

export enum Type {
  Coin = 'COIN',
  FungibleAsset = 'FUNGIBLE_ASSET',
}

export type PoolData = {
  borrowApy: number;
  depositApy: number;
  poolAddress: string;
  token: string;
};
