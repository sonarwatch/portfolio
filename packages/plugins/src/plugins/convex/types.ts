export type PoolsResponse = {
  pools: PoolData[];
};

export type PoolData = {
  id: string;
  address: string;
  coinsAddresses: string[];
  decimals: string[];
  virtualPrice: string;
  amplificationCoefficient: string;
  totalSupply: string;
  name: string;
  assetType: string;
  lpTokenAddress: string;
  symbol: string;
  priceOracle: string;
  poolUrls: {
    swap: string[];
    deposit: string[];
    withdraw: string[];
  };
  implementation: string;
  zapAddress: string;
  assetTypeName: string;
  coins: [
    {
      address: string;
      usdPrice: string;
      decimals: string;
      isBasePoolLpToken: boolean;
      symbol: string;
      poolBalance: string;
      blockchainId: string;
    },
    {
      address: string;
      usdPrice: string;
      decimals: string;
      isBasePoolLpToken: boolean;
      symbol: string;
      poolBalance: string;
      blockchainId: string;
    }
  ];
  usdTotal: string;
  isMetaPool: boolean;
  usdTotalExcludingBasePool: string;
  gaugeAddress: string;
  gaugeRewards: [];
  gaugeCrvApy: string[];
  usesRateOracle: boolean;
  isBroken: boolean;
  registryId: string;
  isGaugeKilled: boolean;
  gaugeWeight: string;
  gaugeRelativeWeight: string;
  blockchainId: string;
  convexPoolData: {
    id: string;
    token: string;
    gauge: string;
    crvRewards: string;
    stash: string;
    shutdown: boolean;
  };
};
