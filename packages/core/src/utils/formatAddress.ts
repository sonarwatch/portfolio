import { getAddress } from '@ethersproject/address';
import {
  assertBitcoinAddress,
  assertEvmAddress,
  assertMoveAddress,
  assertSeiAddress,
  assertSolanaAddress,
} from './validAddress';
import { NetworkIdType } from '../Network';
import { AddressSystem, AddressSystemType } from '../Address';
import { networks } from '../constants';

export function formatBitcoinAddress(address: string) {
  assertBitcoinAddress(address);
  return address;
}

export function formatMoveAddress(address: string) {
  assertMoveAddress(address);
  let fAddress = address.toLocaleLowerCase();
  if (!fAddress.startsWith('0x')) fAddress = `0x${fAddress}`;
  return fAddress;
}

export function formatEvmAddress(address: string) {
  assertEvmAddress(address);
  return getAddress(address.toLocaleLowerCase());
}

export function formatSolanaAddress(address: string) {
  assertSolanaAddress(address);
  return address;
}

export function formatSeiAddress(address: string) {
  assertSeiAddress(address);
  return address.toLocaleLowerCase();
}

const formatters: Record<AddressSystemType, (address: string) => string> = {
  [AddressSystem.solana]: formatSolanaAddress,
  [AddressSystem.bitcoin]: formatBitcoinAddress,
  [AddressSystem.evm]: formatEvmAddress,
  [AddressSystem.move]: formatMoveAddress,
  [AddressSystem.sei]: formatSeiAddress,
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
