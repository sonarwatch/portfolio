export type Contract = {
  chain: string;
  address: `0x${string}`;
};

export type Strategy = {
  strategyAddress: `0x${string}`;
  tokens: `0x${string}`[];
};

export type Operator = {
  address: `0x${string}`;
  shares: Share[];
};

export type Staker = {
  address: `0x${string}`;
  shares: Share[];
};
export type Share = {
  strategyAddress: `0x${string}`;
  shares: string;
};

export type Position = {
  strategyAddress: `0x${string}`;
  underlyingToken?: `0x${string}`;
  decimals?: number;
  amount?: string;
  shares?: bigint;
};

export type Withdrawal = {
  stakerAddress: `0x${string}`;
  delegatedTo: `0x${string}`;
  withdrawerAddress: `0x${string}`;
  shares: Share[];
};

export type WithdrawalShare = {
  strategyAddress: `0x${string}`;
  shares: string;
};
