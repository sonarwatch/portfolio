import { NetworkIdType } from '../Network';
import { networks } from '../constants';

export function getAddressSystemFromNetworkId(networdkId: NetworkIdType) {
  return networks[networdkId].addressSystem;
}
