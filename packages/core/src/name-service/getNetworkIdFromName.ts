import { NetworkId, NetworkIdType } from '../Network';
import { NameIsNotValidError } from '../errors';
import {
  isAptosName,
  isAvalancheName,
  isEthereumName,
  isSolanaName,
} from './isNetworkIdName';

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
  {
    networkId: NetworkId.aptos,
    verifier: isAptosName,
  },
];

export function getNetworkIdFromName(name: string): NetworkIdType | null {
  for (let i = 0; i < verifiers.length; i++) {
    const verifier = verifiers[i];
    if (verifier.verifier(name)) return verifier.networkId;
  }
  return null;
}

export function getNetworkIdFromNameOrFail(name: string): NetworkIdType {
  const networkId = getNetworkIdFromName(name);
  if (!networkId) throw new NameIsNotValidError(name);
  return networkId;
}

export function isNameValid(name: string): boolean {
  return getNetworkIdFromName(name) !== null;
}
