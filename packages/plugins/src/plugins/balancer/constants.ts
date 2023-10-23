import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'balancer';
export const platform: Platform = {
  id: platformId,
  name: 'Balancer',
  image: 'https://sonar.watch/img/platforms/balancer.png',
  defiLlamaId: 'parent#balancer', // from https://defillama.com/docs/api
};
export const poolsCachePrefix = `${platformId}-pools`;
export const farmsCachePrefix = `${platformId}-farms`;

export const ethereumGaugeControllerAddress =
  '0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD';
