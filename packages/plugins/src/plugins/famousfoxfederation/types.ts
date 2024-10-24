export type Order = {
  mint: string;
  owner: string;
  cost: string;
  count: string;
  foxy: boolean;
  staked: boolean;
};

export type StakingAccount = {
  fox: string;
  owner: string;
  lock: string;
  lastClaim: string;
  tff: boolean;
  v2: boolean;
};

export type StakingConfig = {
  reward: string;
  authority: string;
  amount: string;
  interval: string;
  timelock: boolean;
  count: boolean;
  tcount: boolean;
};
