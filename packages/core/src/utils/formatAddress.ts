import { getAddress } from '@ethersproject/address';
import {
  assertBitcoinAddress,
  assertEvmAddress,
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
  assertBitcoinAddress(address);
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

export function formatAddress(address: string, networkId: NetworkIdType) {
  const network = networks[networkId];
  if (!network) throw new Error(`NetworkId not supported: ${networkId}`);

  const formatter = formatters[network.addressSystem];
  return formatter(address);
}
