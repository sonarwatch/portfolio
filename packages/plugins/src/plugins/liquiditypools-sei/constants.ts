import { Platform } from '@sonarwatch/portfolio-core';

export const pluginId = 'liquidityPools-sei';
export const fuzioPlatform: Platform = {
  id: 'fuzio',
  name: 'Fuzio',
  image: 'https://alpha.sonar.watch/img/platforms/fuzio.png',
};
export const seaswapPlatform: Platform = {
  id: 'seaswap',
  name: 'Seaswap',
  image: 'https://alpha.sonar.watch/img/platforms/seaswap.png',
};

export const lpsContractsPrefix = 'lpcontracts';

export const lpsCodeByPlatform: Map<string, number[]> = new Map([
  [seaswapPlatform.id, [15]],
  [fuzioPlatform.id, [57]],
]);

export const lpsNamesByPlatform: Map<string, string[]> = new Map([
  [seaswapPlatform.id, ['SeaSwap_Liquidity_Token']],
  [fuzioPlatform.id, []],
]);
