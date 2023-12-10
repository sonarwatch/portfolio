import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'instadapp';
export const platform: Platform = {
  id: platformId,
  name: 'Instadapp',
  image: 'https://sonar.watch/img/platforms/instadapp.png',
  defiLlamaId: 'instadapp',
  website: 'https://instadapp.io/',
  twitter: 'https://twitter.com/instadapp',
};

export const stEthAddress = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';
export const iETHv2Address = '0xa0d3707c569ff8c87fa923d3823ec5d81c98be78';

export const liteConfigs = [
  {
    name: 'ETH v2',
    address: '0xa0d3707c569ff8c87fa923d3823ec5d81c98be78',
    underlyingAddress: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    decimals: 18,
  },
];
