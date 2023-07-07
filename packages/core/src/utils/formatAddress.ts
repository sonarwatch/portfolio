import { getAddress } from '@ethersproject/address';
import {
  assertBitcoinAddress,
  assertEvmAddress,
  assertMoveAddress,
  assertSolanaAddress,
} from './addressValid';
import { NetworkIdType } from '../Network';
import { AddressSystem, AddressSystemType } from '../Address';
import { networks } from '../constants';

export function formatBitcoinAddress(address: string) {
  assertBitcoinAddress(address);
  return address;
}

export function formatMoveAddress(address: string) {
  assertMoveAddress(address);
  return address.toLocaleLowerCase();
}

export function formatEvmAddress(address: string) {
  assertEvmAddress(address);
  return getAddress(address.toLocaleLowerCase());
}

export function formatSolanaAddress(address: string) {
  assertSolanaAddress(address);
  return address;
}

const formatters: Record<AddressSystemType, (address: string) => string> = {
  [AddressSystem.solana]: formatSolanaAddress,
  [AddressSystem.bitcoin]: formatBitcoinAddress,
  [AddressSystem.evm]: formatEvmAddress,
  [AddressSystem.move]: formatMoveAddress,
};

export function formatAddress(
  address: string,
  addressSystem: AddressSystemType
) {
  const formatter = formatters[addressSystem];
  return formatter(address);
}

export function formatAddressByNetworkId(
  address: string,
  networkId: NetworkIdType
) {
  const network = networks[networkId];
  if (!network) throw new Error(`NetworkId not supported: ${networkId}`);
  return formatAddress(address, network.addressSystem);
}
