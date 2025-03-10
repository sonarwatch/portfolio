import { Platform } from '@sonarwatch/portfolio-core';
import { Contract } from './types';

export const platformId = 'yearn';
export const platform: Platform = {
  id: platformId,
  name: 'Yearn',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/yearn.webp',
  website: 'https://yearn.fi/',
  defiLlamaId: 'yearn-finance', // from https://defillama.com/docs/api
  // twitter: 'https://twitter.com/myplatform',
};
export const vaultsKey = 'vaults';
export const yearnApiUrl = 'https://api.yexporter.io/v1/chains';
export const lockersEth: Contract[] = [
  {
    address: '0x90c1f9220d90d3966fbee24045edd73e1d588ad5',
    underlying: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
  },
];

export const yETHStake: Contract[] = [
  {
    address: '0x1bed97cbc3c24a4fb5c069c6e311a967386131f7',
    underlying: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
];

export const styETHStake: Contract[] = [
  {
    address: '0x583019ff0f430721ada9cfb4fac8f06ca104d0b4',
    underlying: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
];
