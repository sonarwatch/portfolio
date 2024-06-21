export type UserDeposit = {
  userAddress: string;
  mint: string;
  lpAmount: string;
  rewardDebt: string;
};

export type Pools = {
  bridgeAddress: string;
  swapAddress: string;
  tokens: TokenPool[];
};

export type TokenPool = {
  apr: string;
  apr7d: string;
  apr30d: string;
  cctpAddress: string;
  cctpFeeShare: string;
  decimals: number;
  feeShare: string;
  lpRate: string;
  name: string;
  poolAddress: string;
  poolInfo: PoolInfo;
  symbol: string;
  tokenAddress: string;
};

export type PoolInfo = {
  aValue: string;
  accRewardPerShareP: string;
  dValue: string;
  p: number;
  tokenBalance: string;
  totalLpAmount: string;
  vUsdBalance: string;
};

export type PoolsRes = {
  SOL: Pools;
};
