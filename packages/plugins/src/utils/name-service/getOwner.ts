import {
  NSOwner,
  NetworkId,
  formatAddress,
  getAddressSystemFromNetworkId,
  getNetworkIdFromNameOrFail,
} from '@sonarwatch/portfolio-core';
import { getOwnerSolana } from './solana';
import { getOwnerEthereum } from './ethereum';
import { getOwnerAptos } from './aptos';

export async function getOwner(name: string): Promise<NSOwner> {
  const networkId = getNetworkIdFromNameOrFail(name);
  const addressSystem = getAddressSystemFromNetworkId(networkId);
  let address: string | null = null;

  switch (networkId) {
    case NetworkId.solana:
      address = await getOwnerSolana(name);
      break;
    case NetworkId.avalanche:
      address = await getOwnerSolana(name);
      break;
    case NetworkId.ethereum:
      address = await getOwnerEthereum(name);
      break;
    case NetworkId.aptos:
      address = await getOwnerAptos(name);
      break;
    default:
      break;
  }

  return {
    address: address ? formatAddress(address, addressSystem) : null,
    addressSystem,
    networkId,
  };
}
