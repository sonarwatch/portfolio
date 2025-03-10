import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'instadapp';
export const platform: Platform = {
  id: platformId,
  name: 'Instadapp',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/instadapp.webp',
  defiLlamaId: 'instadapp',
  website: 'https://instadapp.io/',
  twitter: 'https://twitter.com/instadapp',
};

export const liteConfigs = [
  {
    name: 'iETH v2',
    version: 2,
    address: '0xa0d3707c569ff8c87fa923d3823ec5d81c98be78',
    underlyingAddress: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    decimals: 18,
  },
  {
    name: 'iETH v1',
    version: 1,
    address: '0xc383a3833A87009fD9597F8184979AF5eDFad019',
    underlyingAddress: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    decimals: 18,
  },
  {
    name: 'iUSDC v1',
    version: 1,
    address: '0xc8871267e07408b89aA5aEcc58AdCA5E574557F8',
    underlyingAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
];
