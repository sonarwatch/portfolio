import { Network, NetworkIdType } from '../Network';
import { networks } from '../constants';

export function getNetworkById(networkId: NetworkIdType): Network {
  return networks[networkId];
}
