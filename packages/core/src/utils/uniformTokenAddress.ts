import { NetworkIdType } from '../Network';
import { AddressSystem, AddressSystemType } from '../Address';
import { networks } from '../constants';
import {
  assertBitcoinTokenAddress,
  assertMoveTokenAddress,
  assertSeiTokenAddress,
} from './validTokenAddress';
import {
  uniformEvmAddress,
  uniformMoveAddress,
  uniformSolanaAddress,
} from './uniformAddress';

export function uniformBitcoinTokenAddress(address: string) {
  assertBitcoinTokenAddress(address);
  return address;
}

export function uniformMoveTokenAddress(address: string) {
  assertMoveTokenAddress(address);
  const splits = address.split('::');
  splits[0] = uniformMoveAddress(splits[0]);
  return splits.join('::');
}

export function uniformEvmTokenAddress(address: string) {
  return uniformEvmAddress(address);
}

export function uniformSolanaTokenAddress(address: string) {
  return uniformSolanaAddress(address);
}

export function uniformSeiTokenAddress(address: string) {
  assertSeiTokenAddress(address);
  return address;
}

const uniformers: Record<AddressSystemType, (address: string) => string> = {
  [AddressSystem.solana]: uniformSolanaTokenAddress,
  [AddressSystem.bitcoin]: uniformBitcoinTokenAddress,
  [AddressSystem.evm]: uniformEvmTokenAddress,
  [AddressSystem.move]: uniformMoveTokenAddress,
  [AddressSystem.sei]: uniformSeiTokenAddress,
};

export function uniformTokenAddress(address: string, networkId: NetworkIdType) {
  const network = networks[networkId];
  if (!network) throw new Error(`NetworkId not supported: ${networkId}`);

  const uniformer = uniformers[network.addressSystem];
  return uniformer(address);
}

export function uniformTokenAddressFromAddressSystem(
  address: string,
  addressSystem: AddressSystemType
) {
  const uniformer = uniformers[addressSystem];
  return uniformer(address);
}
