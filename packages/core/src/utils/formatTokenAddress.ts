import { getAddress } from '@ethersproject/address';
import { NetworkIdType } from '../Network';
import { AddressSystem, AddressSystemType } from '../Address';
import { networks } from '../constants';
import {
  assertBitcoinTokenAddress,
  assertEvmTokenAddress,
  assertMoveTokenAddress,
  assertSolanaTokenAddress,
} from './validTokenAddress';
import { md5 } from './md5';
import { isMd5 } from './isMd5';

export function formatBitcoinTokenAddress(address: string) {
  assertBitcoinTokenAddress(address);
  return address;
}

export function formatMoveTokenAddress(address: string) {
  assertMoveTokenAddress(address);
  if (isMd5(address)) return address;
  return md5(address);
}

export function formatEvmTokenAddress(address: string) {
  assertEvmTokenAddress(address);
  return getAddress(address.toLocaleLowerCase());
}

export function formatSolanaTokenAddress(address: string) {
  assertSolanaTokenAddress(address);
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
