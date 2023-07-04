export type TokenData = {
  address: string;
  decimals: number;
  isBase: boolean;
  coingeckoId: string;
};

export type CoingeckoSimpleRes = Record<
  string,
  {
    usd?: number;
  }
>;
