import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'balancer';
export const platform: Platform = {
  id: platformId,
  name: 'Balancer',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/balancer.webp',
  defiLlamaId: 'parent#balancer', // from https://defillama.com/docs/api
  website: 'https://balancer.fi/',
};
export const poolsAndGaugesV2CacheKey = `${platformId}-pools-and-gauges-v2`;

export const ethGaugeControllerAddress =
  '0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD';
