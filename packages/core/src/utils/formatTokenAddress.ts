import { getAddress } from '@ethersproject/address';
import {
  assertBitcoinAddress,
  assertEvmAddress,
  assertSolanaAddress,
} from './validAddress';
import { NetworkIdType } from '../Network';
import { AddressSystem, AddressSystemType } from '../Address';
import { networks } from '../constants';

export function formatBitcoinTokenAddress(address: string) {
  assertBitcoinAddress(address);
  return address;
}

export function formatMoveTokenAddress(address: string) {
  return address;
}

export function formatEvmTokenAddress(address: string) {
  assertEvmAddress(address);
  return getAddress(address.toLocaleLowerCase());
}

export function formatSolanaTokenAddress(address: string) {
  assertSolanaAddress(address);
  return address;
}

const formatters: Record<AddressSystemType, (address: string) => string> = {
  [AddressSystem.solana]: formatSolanaTokenAddress,
  [AddressSystem.bitcoin]: formatBitcoinTokenAddress,
  [AddressSystem.evm]: formatEvmTokenAddress,
  [AddressSystem.move]: formatMoveTokenAddress,
};

export function formatTokenAddress(address: string, networkId: NetworkIdType) {
  const network = networks[networkId];
  if (!network) throw new Error(`NetworkId not supported: ${networkId}`);

  const formatter = formatters[network.addressSystem];
  return formatter(address);
}
