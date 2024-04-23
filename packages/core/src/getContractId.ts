import { NetworkIdType } from './Network';

export function getContractId(networkId: NetworkIdType, address: string) {
  return `${networkId}_${address}`;
}
