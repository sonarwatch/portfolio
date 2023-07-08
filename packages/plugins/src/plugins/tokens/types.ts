export type TokenData = {
  address: string;
  decimals: number;
  platformId: string;
  coingeckoId: string;
};

export type CoingeckoSimpleRes = Record<
  string,
  {
    usd?: number;
  }
>;
