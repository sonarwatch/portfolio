import { NetworkId, NetworkIdType } from '../Network';

export function getNetworkIdFromString(
  networkId: string
): NetworkIdType | null {
  if (networkId in NetworkId) return networkId as NetworkIdType;
  return null;
}

export function networkIdFromString(networkId: string): NetworkIdType {
  const nNetworkId = getNetworkIdFromString(networkId);
  if (!nNetworkId) throw new Error(`networkId not valid: ${networkId}`);
  return nNetworkId;
}
