import { NetworkIdType } from '../Network';
import { networks } from '../constants';

export function assetNetworkId(networkId: string): NetworkIdType {
  const network = networks[networkId as NetworkIdType];
  if (!network) throw new Error(`NetworkId is not valid: ${networkId}`);
  return networkId as NetworkIdType;
}
