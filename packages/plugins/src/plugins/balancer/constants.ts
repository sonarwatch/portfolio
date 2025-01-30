import { NetworkId, Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'balancer';
export const platform: Platform = {
  id: platformId,
  name: 'Balancer',
  image: 'https://sonar.watch/img/platforms/balancer.webp',
  defiLlamaId: 'parent#balancer', // from https://defillama.com/docs/api
  website: 'https://balancer.fi/',
};
export const poolsAndGaugesV2CacheKey = `${platformId}-pools-and-gauges-v2`;

export const ethGaugeControllerAddress =
  '0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD';

export enum BalancerV2APINetwork {
  ethereum = 'MAINNET',
  polygon = 'POLYGON',
  avalanche = 'AVALANCHE',
  fraxtal = 'FRAXTAL',
}

export type BalancerSupportedEvmNetworkIdType =
  | typeof NetworkId.ethereum
  | typeof NetworkId.polygon
  | typeof NetworkId.avalanche
  | typeof NetworkId.fraxtal;

export const balancerApiNetworkByNetworkId: Record<
  BalancerSupportedEvmNetworkIdType,
  BalancerV2APINetwork
> = {
  [NetworkId.ethereum]: BalancerV2APINetwork.ethereum,
  [NetworkId.polygon]: BalancerV2APINetwork.polygon,
  [NetworkId.avalanche]: BalancerV2APINetwork.avalanche,
  [NetworkId.fraxtal]: BalancerV2APINetwork.fraxtal,
};

/* 
  WARNING:
  All the urls here are now dev urls which are rate limited
  To use these in production switch them out for the production subgraph
  This requires a paid api key and can be found here
  @see https://docs-v2.balancer.fi/reference/subgraph/
*/
export const theGraphPoolConfig = [
  {
    poolsUrl:
      'https://api.studio.thegraph.com/query/75376/balancer-v2/version/latest',
    gaugesUrl:
      'https://api.studio.thegraph.com/query/75376/balancer-gauges/version/latest',
    networkId: NetworkId.ethereum,
  },
  {
    poolsUrl:
      'https://api.studio.thegraph.com/query/75376/balancer-avalanche-v2/version/latest',
    gaugesUrl:
      'https://api.studio.thegraph.com/query/75376/balancer-gauges-avalanche/version/latest',
    networkId: NetworkId.avalanche,
  },
  {
    poolsUrl:
      'https://api.studio.thegraph.com/query/75376/balancer-polygon-v2/version/latest',
    gaugesUrl:
      'https://api.studio.thegraph.com/query/75376/balancer-gauges-polygon/version/latest',
    networkId: NetworkId.polygon,
  },
  {
    poolsUrl: null,
    gaugesUrl: null,
    networkId: NetworkId.fraxtal,
  },
];
