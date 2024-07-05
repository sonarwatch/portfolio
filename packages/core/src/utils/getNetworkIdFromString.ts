import { NetworkId, NetworkIdType } from '../Network';

export function getNetworkIdFromString(
  networkId: string
): NetworkIdType | null {
  if (networkId in NetworkId) return networkId as NetworkIdType;
  return null;
}
