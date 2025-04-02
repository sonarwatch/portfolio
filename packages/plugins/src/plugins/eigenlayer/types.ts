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
};
