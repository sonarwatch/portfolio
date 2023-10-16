export type GetAllGaugesResponse = {
  success: boolean;
  data: { [key: string]: GaugeDatum };
  generatedTimeMs: number;
};

export type GaugeDatum = {
  poolUrls: PoolUrls;
  swap: string;
  swap_token: string;
  name: string;
  shortName: string;
  gauge: string;
  gauge_data: GaugeData;
  gauge_controller: GaugeController;
  factory: boolean;
  side_chain: boolean;
  is_killed: boolean;
  hasNoCrv: boolean;
  type: Type;
  lpTokenPrice: number | null;
  swap_data?: SwapData;
  gaugeStatus?: GaugeStatus;
};

export type GaugeStatus = {
  areCrvRewardsStuckInBridge: boolean;
  rewardsNeedNudging: boolean;
};

export type GaugeController = {
  gauge_relative_weight: string;
  get_gauge_weight: string;
  inflation_rate: number | string;
};

export type GaugeData = {
  inflation_rate: number | string;
  working_supply: string;
};

export type PoolUrls = {
  swap: string[];
  deposit: string[];
  withdraw: string[];
};

export type SwapData = {
  virtual_price: number | string;
};

export enum Type {
  Crypto = 'crypto',
  Stable = 'stable',
}
