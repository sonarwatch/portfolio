import { Platform } from '@sonarwatch/portfolio-core';
import {
  TokensInfosGetter,
  getTokensInfosV2,
  getTokensInfosV1,
} from './helpers';

export const seaswapPlatform: Platform = {
  id: 'seaswap',
  name: 'Seaswap',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/seaswap.webp',
  defiLlamaId: 'seaswap',
  website: 'https://seaswap.io/',
};
export const astroportPlatform: Platform = {
  id: 'astroport',
  name: 'Astroport',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/astroport.webp',
  website: 'https://astroport.fi',
  twitter: 'https://twitter.com/astroport_fi',
  defiLlamaId: 'astroport',
};

export const liquidityPoolsKey = 'liquiditypools';
export const liquidityPoolsInfos: LiquidityPoolsInfo[] = [
  {
    platformId: astroportPlatform.id,
    codes: [3, 149],
    getter: getTokensInfosV1,
  },
  {
    platformId: seaswapPlatform.id,
    codes: [15],
    namesFilters: ['SeaSwap_Liquidity_Token'],
    getter: getTokensInfosV2,
  },
];

type LiquidityPoolsInfo = {
  platformId: string; // The platform of the LPs
  codes: number[]; // Store all LPs contracts
  namesFilters?: string[]; // Use to filter on LPs name
  getter: TokensInfosGetter; // A function to retrieve tokens breakdown within the LP
};
