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

export type TokenList = {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tags: object;
  logoURI: string;
  keywords: string[];
  tokens: TokenListItem[];
};

export type TokenListItem = {
  chainId: number;
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  logoURI: string;
  tags?: string[];
  extensions?: {
    coingeckoId: string;
  };
};
