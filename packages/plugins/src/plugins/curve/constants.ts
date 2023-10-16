import {
  EvmNetworkIdType,
  NetworkId,
  Platform,
} from '@sonarwatch/portfolio-core';

export const platformId = 'curve';
export const fooPlatform: Platform = {
  id: platformId,
  name: 'Curve Finance',
  image: 'https://sonar.watch/img/platforms/curve.png',
  defiLlamaId: 'parent#curve-finance',
};
export const poolsCachePrefix = `${platformId}-pools`;
export const gaugesCachePrefix = `${platformId}-gauges`;
export const lpAddresesCachePrefix = `${platformId}-lp-addresses`;
export const poolsAddresesCachePrefix = `${platformId}-pools-addresses`;
export const gaugesAddresesCachePrefix = `${platformId}-gauges-addresses`;

export const apiBaseUrl = 'https://api.curve.fi/api';

export enum CrvNetworkId {
  ethereum = 'ethereum',
  polygon = 'polygon',
  avalanche = 'avalanche',
}

export const crvNetworkIds = Object.values(CrvNetworkId);

export const crvNetworkIdBySwNetworkId: Record<CrvNetworkId, EvmNetworkIdType> =
  {
    [CrvNetworkId.ethereum]: NetworkId.ethereum,
    [CrvNetworkId.polygon]: NetworkId.polygon,
    [CrvNetworkId.avalanche]: NetworkId.avalanche,
  };
