export type Type = {
  fields: TypeFields;
  type: string;
};

export type TypeFields = {
  name: string;
};

export type TickIndex = {
  fields: BitsFields;
  type: string;
};

export type BitsFields = {
  bits: number;
};

export type RewardInfo = {
  fields: RewardInfoFields;
  type: string;
};

export type RewardInfoFields = {
  coins_owed_reward: string;
  reward_growth_inside_last: string;
};

export enum Dex {
  cetus,
  kriya,
}

export type VaultConfig = {
  id: string;
  tokenType: string;
  underlyingPool: string;
  underlyingDex: Dex;
};

export type VaultPositionInfo = {
  id: string;
  farmId: string;
  coinType: string;
  lowerTick: number;
  upperTick: number;
  currentTickIndex: number;
  liquidity: string;
  totalSupply: string;
  mintA: string;
  mintB: string;
  amountA: string;
  amountB: string;
};
