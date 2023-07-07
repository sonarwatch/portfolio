import { NetworkIdType } from '../Network';

export function isNetworkIdIncluded(
  networkId: NetworkIdType,
  networkIds: NetworkIdType[]
): boolean {
  return networkIds.includes(networkId);
}

export function assertNetworkIdIncluded(
  networkId: NetworkIdType,
  networkIds: NetworkIdType[]
): void {
  if (!isNetworkIdIncluded(networkId, networkIds))
    throw new Error(
      `Network id is not included: ${networkId} [${networkIds.join(',')}]`
    );
}
