/**
 * Asserts the validity of a network ID.
 *
 * @param networkId - The network ID to be validated.
 * @returns The validated network ID.
 * @throws Error if the network ID is not valid.
 */
import { NetworkIdType } from '../Network';
import { networks } from '../constants';

export function assertNetworkId(networkId: string): NetworkIdType {
  const network = networks[networkId as NetworkIdType];
  if (!network) throw new Error(`NetworkId is not valid: ${networkId}`);
  return networkId as NetworkIdType;
}
