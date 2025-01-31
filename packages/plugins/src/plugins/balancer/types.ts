export type Pool = {
  id: string;
  address: string;
  symbol: string;
  tokens: PoolToken[];
  totalLiquidity: string;
  totalShares: string;
};

export type PoolToken = {
  decimals: number;
  symbol: string;
  address: string;
  balance: string;
};

export type PoolApiResponse = {
  id: string;
  address: string;
  symbol: string;
  tokens: PoolToken[];
  dynamicData: {
    totalLiquidity: string;
    totalShares: string;
  };
};

export type GaugesByPool = Record<string, string[]>;

export type OwnerPoolApiResponse = {
  address: string;
  name: string;
  symbol: string;
  dynamicData: {
    totalShares: string;
  };
  poolTokens: {
    address: string;
    symbol: string;
    name: string;
    balance: string;
    logoURI: string;
    decimals: number;
  }[];
  userBalance: {
    walletBalance: string;
    totalBalance: string;
  };
};
