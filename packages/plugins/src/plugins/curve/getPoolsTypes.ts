import { TokenPrice } from '@sonarwatch/portfolio-core';

export type GetPoolsResponse = {
  success: boolean;
  data: GetPoolsData;
  generatedTimeMs: number;
};

export type GetPoolsData = {
  poolData: PoolDatumRaw[];
  tvlAll: number;
  tvl: number;
};

export type PoolDatumRaw = {
  id: string;
  address: string;
  coinsAddresses: string[];
  decimals: string[];
  virtualPrice: number | string;
  amplificationCoefficient: string;
  assetType?: string;
  totalSupply: string;
  name: string;
  implementationAddress?: string;
  symbol?: string;
  poolUrls: PoolUrls;
  implementation: string;
  lpTokenAddress: string;
  assetTypeName: AssetTypeName;
  coins: Coin[];
  usdTotal: number;
  isMetaPool: boolean;
  usdTotalExcludingBasePool: number;
  usesRateOracle: boolean;
  isBroken: boolean;
  gaugeAddress?: string;
  gaugeRewards?: GaugeReward[];
  gaugeCrvApy?: Array<number | null>;
  underlyingDecimals?: string[];
  zapAddress?: string;
  underlyingCoins?: Coin[];
  priceOracle?: number;
};

export type PoolDatum = PoolDatumRaw & {
  coinsTokenPrices: Record<string, TokenPrice>;
};

export enum AssetTypeName {
  Btc = 'btc',
  Eth = 'eth',
  Other = 'other',
  Unknown = 'unknown',
  Usd = 'usd',
}

export type Coin = {
  address: string;
  usdPrice: number | null;
  decimals: number | string;
  isBasePoolLpToken: boolean;
  symbol: string;
  poolBalance: string;
  ethLsdApy?: number;
};

export type GaugeReward = {
  gaugeAddress: string;
  tokenPrice?: number;
  name: string;
  symbol: string;
  decimals: number | string;
  tokenAddress: string;
  apy: number | null;
};

export type PoolUrls = {
  swap: string[];
  deposit: string[];
  withdraw: string[];
};
