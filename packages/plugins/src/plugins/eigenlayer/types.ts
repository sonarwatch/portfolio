import { Address } from 'viem';

export type Contract = {
  chain: string;
  address: Address;
};

export type Strategy = {
  strategyAddress: Address;
  tokens: Address[];
};

export type Operator = {
  address: Address;
  shares: Share[];
};

export type Staker = {
  address: Address;
  shares: Share[];
};
export type Share = {
  strategyAddress: Address;
  shares: string;
};

export type Position = {
  strategyAddress: Address;
  underlyingToken?: Address;
  decimals?: number;
  amount?: string;
  shares?: bigint;
};

export type Withdrawal = {
  stakerAddress: Address;
  delegatedTo: Address;
  withdrawerAddress: Address;
  shares: Share[];
};

export type WithdrawalShare = {
  strategyAddress: Address;
  shares: string;
};
