import { getAddress } from '@ethersproject/address';
import { NetworkIdType } from '../Network';
import { AddressSystem, AddressSystemType } from '../Address';
import { networks } from '../constants';
import {
  assertBitcoinTokenAddress,
  assertEvmTokenAddress,
  assertSeiTokenAddress,
  assertSolanaTokenAddress,
} from './validTokenAddress';
import { uniformMoveTokenAddress } from './uniformTokenAddress';

export function formatBitcoinTokenAddress(address: string) {
  assertBitcoinTokenAddress(address);
  return address;
}

export function formatMoveTokenAddress(address: string) {
  return uniformMoveTokenAddress(address);
}

export function formatEvmTokenAddress(address: string) {
  assertEvmTokenAddress(address);
  return getAddress(address.toLowerCase());
}

export function formatSolanaTokenAddress(address: string) {
  assertSolanaTokenAddress(address);
  return address;
}

export function formatSeiTokenAddress(address: string) {
  assertSeiTokenAddress(address);
  return address.replace(/\//g, '_');
}

const formatters: Record<AddressSystemType, (address: string) => string> = {
  [AddressSystem.solana]: formatSolanaTokenAddress,
  [AddressSystem.bitcoin]: formatBitcoinTokenAddress,
  [AddressSystem.evm]: formatEvmTokenAddress,
  [AddressSystem.move]: formatMoveTokenAddress,
  [AddressSystem.sei]: formatSeiTokenAddress,
};

export function formatTokenAddress(address: string, networkId: NetworkIdType) {
  const network = networks[networkId];
  if (!network) throw new Error(`NetworkId not supported: ${networkId}`);

  const formatter = formatters[network.addressSystem];
  return formatter(address);
}

export function formatTokenAddressFromAddressSystem(
  address: string,
  addressSystem: AddressSystemType
) {
  const formatter = formatters[addressSystem];
  return formatter(address);
}
