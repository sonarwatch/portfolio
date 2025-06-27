import { NetworkIdType } from '../Network';
import { networks } from '../constants';

export function getAddressSystemFromNetworkId(networkId: NetworkIdType) {
  return networks[networkId].addressSystem;
}
