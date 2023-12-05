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
import { isNativeAddressAliasSui } from './isNativeAddressAlias';

export function formatBitcoinTokenAddress(address: string) {
  assertBitcoinTokenAddress(address);
  return address;
}

export function formatMoveTokenAddress(address: string) {
  assertMoveTokenAddress(address);
  const tAddress = isNativeAddressAliasSui(address)
    ? networks.sui.native.address
    : address;
  return tAddress
    .trim()
    .replaceAll('::', '__')
    .replaceAll(',', '-')
    .replaceAll(/[^\w\s-]/g, '')
    .replaceAll(/[\s_-]+/g, '-');
}

export function formatEvmTokenAddress(address: string) {
  assertEvmTokenAddress(address);
  return getAddress(address.toLocaleLowerCase());
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
