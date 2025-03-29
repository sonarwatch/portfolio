import { NetworkId } from '@sonarwatch/portfolio-core';

export const platformId = 'balancer2';

enum BalancerV2APINetwork {
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

export const balancerApiUrl = 'https://api-v3.balancer.fi';
