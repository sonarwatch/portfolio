import { NetworkIdType } from '@sonarwatch/portfolio-core';

export type QuotesRes = {
  data: {
    [key: string]: {
      slug: string;
      quote: {
        USD: {
          price: number;
        };
      };
    };
  };
};

export type CmcToken = {
  slug: string;
  tokens: {
    mint: string;
    decimals: number;
    networkId: NetworkIdType;
  }[];
};
