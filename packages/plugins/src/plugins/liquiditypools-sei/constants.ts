import { Platform } from '@sonarwatch/portfolio-core';
import {
  TokensInfosGetter,
  getTokensInfosV2,
  getTokensInfosV1,
} from './helpers';

export const pluginId = 'liquidityPools-sei';
export const fuzioPlatform: Platform = {
  id: 'fuzio',
  name: 'Fuzio',
  image: 'https://alpha.sonar.watch/img/platforms/fuzio.png',
  defiLlamaId: 'fuzio',
};
export const seaswapPlatform: Platform = {
  id: 'seaswap',
  name: 'Seaswap',
  image: 'https://alpha.sonar.watch/img/platforms/seaswap.png',
  defiLlamaId: 'seaswap',
};
export const astroportPlatform: Platform = {
  id: 'astroport',
  name: 'Astroport',
  image: 'https://alpha.sonar.watch/img/platforms/astroport.png',
};

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
  {
    platformId: fuzioPlatform.id,
    codes: [57],
    getter: getTokensInfosV2,
  },
];

type LiquidityPoolsInfo = {
  platformId: string; // The platform of the LPs
  codes: number[]; // Store all LPs contracts
  namesFilters?: string[]; // Use to filter on LPs name
  getter: TokensInfosGetter; // A function to retrieve tokens breakdown within the LP
};
