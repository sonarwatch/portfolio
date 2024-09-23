export type StablePool = {
  owner: string;
  vault: string;
  mint: string;
  authorityBump: string;
  isActive: boolean;
  ampInitialFactor: string;
  ampTargetFactor: string;
  rampStartTs: string;
  rampStopTs: string;
  swapFee: string;
  tokens: StablePoolToken[];
  pendingOwner?: string;
};

export type StablePoolToken = {
  mint: string;
  decimals: string;
  scalingUp: boolean;
  scalingFactor: string;
  balance: string;
};

export type WeightedPool = {
  owner: string;
  vault: string;
  mint: string;
  authorityBump: string;
  isActive: boolean;
  invariant: string;
  swapFee: string;
  tokens: StablePoolToken[];
  pendingOwner?: string;
};

export type WeightedPoolToken = {
  mint: string;
  decimals: string;
  scalingUp: boolean;
  scalingFactor: string;
  balance: string;
  weight: string;
};
