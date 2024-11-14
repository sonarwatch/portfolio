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

export type UniTokenAddress = string;

export function uniformBitcoinTokenAddress(address: string): UniTokenAddress {
  assertBitcoinTokenAddress(address);
  return address;
}

export function uniformMoveTokenAddress(address: string): UniTokenAddress {
  assertMoveTokenAddress(address);
  const splits = address.split('::');
  splits[0] = uniformMoveAddress(splits[0]);
  return splits.join('::');
}

export function uniformEvmTokenAddress(address: string): UniTokenAddress {
  return uniformEvmAddress(address);
}

export function uniformSolanaTokenAddress(address: string): UniTokenAddress {
  return uniformSolanaAddress(address);
}

export function uniformSeiTokenAddress(address: string): UniTokenAddress {
  assertSeiTokenAddress(address);
  return address;
}

const uniformers: Record<
  AddressSystemType,
  (address: string) => UniTokenAddress
> = {
  [AddressSystem.solana]: uniformSolanaTokenAddress,
  [AddressSystem.bitcoin]: uniformBitcoinTokenAddress,
  [AddressSystem.evm]: uniformEvmTokenAddress,
  [AddressSystem.move]: uniformMoveTokenAddress,
  [AddressSystem.sei]: uniformSeiTokenAddress,
};

export function uniformTokenAddress(
  address: string,
  networkId: NetworkIdType
): UniTokenAddress {
  const network = networks[networkId];
  if (!network) throw new Error(`NetworkId not supported: ${networkId}`);

  const uniformer = uniformers[network.addressSystem];
  return uniformer(address);
}

export function uniformTokenAddressFromAddressSystem(
  address: string,
  addressSystem: AddressSystemType
): UniTokenAddress {
  const uniformer = uniformers[addressSystem];
  return uniformer(address);
}
