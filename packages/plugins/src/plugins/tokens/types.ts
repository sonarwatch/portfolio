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
  tokens: Token[];
};

export type Token = {
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

export type SuiNFTMetadata = {
  attributes?: {
    type: string;
    fields: {
      map: {
        type: string;
        fields: {
          contents: Attribute[];
        };
      };
    };
  };
  id: {
    id: string;
  };
  name: string;
  description?: string;
  url?: string;
  image_url?: string;
  index?: string;
};

export type Attribute = {
  [key: number]: {
    type: string;
    fields: {
      key: string;
      value: string;
    };
  };
};

export type DisplayInfo = {
  description: string;
  image_url: string;
  link: string;
  name: string;
};
