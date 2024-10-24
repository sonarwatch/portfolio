import { getAddress } from '@ethersproject/address';
import { NetworkIdType } from '../Network';
import { AddressSystem, AddressSystemType } from '../Address';
import { networks } from '../constants';
import {
  assertBitcoinTokenAddress,
  assertEvmTokenAddress,
  assertMoveTokenAddress,
  assertSeiTokenAddress,
  assertSolanaTokenAddress,
} from './validTokenAddress';
import { formatMoveAddress } from './formatAddress';

export function formatBitcoinTokenAddress(address: string) {
  assertBitcoinTokenAddress(address);
  return address;
}

export function formatMoveTokenAddress(address: string) {
  assertMoveTokenAddress(address);
  let tAddress = address;
  if (!address.startsWith('0x')) tAddress = `0x${tAddress}`;
  tAddress = tAddress
    .trim()
    .replaceAll('::', '__')
    .replaceAll(',', '-')
    .replaceAll(/[^\w\s-]/g, '')
    .replaceAll(/[\s_-]+/g, '-');

  const splitted = tAddress.split('-');
  splitted[0] = formatMoveAddress(splitted[0]);

  return splitted.join('-');
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
