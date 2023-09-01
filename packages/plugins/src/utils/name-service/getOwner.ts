import {
  AddressSystemType,
  NetworkId,
  NetworkIdType,
  getAddressSystemFromNetworkId,
} from '@sonarwatch/portfolio-core';
import { getOwnerSolana, isSolanaName } from './solana';
import { getOwnerEthereum, isEthereumName } from './ethereum';
import { isAvalancheName } from './avalanche';

const verifiers: {
  networkId: NetworkIdType;
  verifier: (name: string) => boolean;
}[] = [
  {
    networkId: NetworkId.solana,
    verifier: isSolanaName,
  },
  {
    networkId: NetworkId.ethereum,
    verifier: isEthereumName,
  },
  {
    networkId: NetworkId.avalanche,
    verifier: isAvalancheName,
  },
];

function getNetworkIdFromName(name: string) {
  for (let i = 0; i < verifiers.length; i++) {
    const verifier = verifiers[i];
    if (verifier.verifier(name)) return verifier.networkId;
  }
  throw new Error(`Name is not valid: ${name}`);
}

export async function getOwner(name: string): Promise<{
  address: string | null;
  addressSystem: AddressSystemType;
  networkId: NetworkIdType;
}> {
  const networkId = getNetworkIdFromName(name);
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
    default:
      break;
  }

  return {
    address,
    addressSystem,
    networkId,
  };
}
