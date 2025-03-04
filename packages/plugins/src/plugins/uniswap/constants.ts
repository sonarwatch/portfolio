import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { UniswapNetworkConfig } from './types';

export const platformId = 'uniswap';
export const platform: Platform = {
  id: platformId,
  name: 'Uniswap',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/uniswap.webp',
  defiLlamaId: 'parent#uniswap',
  website: 'https://uniswap.org/',
};

export const poolsPrefix = 'uniswap-v3';
export const poolsKey = 'poolsInfo';

export const uniswapNetworksConfigs: UniswapNetworkConfig[] = [
  {
    networkId: NetworkId.ethereum,
    factory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
    positionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
  },
  {
    networkId: NetworkId.polygon,
    factory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
    positionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
  },
  // {
  //   networkId: NetworkId.arbitrum,
  //   factory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
  //   positionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
  // },
  // {
  //   networkId: NetworkId.base,
  //   factory: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
  //   positionManager: '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1',
  // },
  {
    networkId: NetworkId.bnb,
    factory: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7',
    positionManager: '0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613',
  },
  // {
  //   networkId: NetworkId.optimism,
  //   factory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
  //   positionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
  // },
];
