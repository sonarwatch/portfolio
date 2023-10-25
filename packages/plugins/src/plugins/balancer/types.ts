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

export type GaugesByPool = Record<string, string[]>;
