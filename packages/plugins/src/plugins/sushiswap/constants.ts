import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'sushiswap';
export const platform: Platform = {
  id: platformId,
  name: 'Sushiswap',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/sushiswap.webp',
  defiLlamaId: 'sushiswap', // from https://defillama.com/docs/api
  website: 'https://www.sushi.com/',
  twitter: 'https://twitter.com/SushiSwap',
};

export const theGraphV3 =
  'https://api.thegraph.com/subgraphs/name/sushi-v3/v3-ethereum';
export const ethereumTheGraphV2 =
  'https://api.thegraph.com/subgraphs/name/sushiswap/exchange';
export const avalancheTheGraphV2 =
  'https://api.thegraph.com/subgraphs/name/sushiswap/avalanche-exchange';
export const polygonTheGraphV2 =
  'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange';
export const bnbTheGraphV2 =
  'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-exchange';
