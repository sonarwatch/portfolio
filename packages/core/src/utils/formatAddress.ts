import { getAddress } from '@ethersproject/address';
import { arrayify, hexlify, hexValue } from '@ethersproject/bytes';
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
  let fAddress = address.toLowerCase();
  if (!fAddress.startsWith('0x')) {
    fAddress = `0x${fAddress}`;
  }
  if (hexValue(fAddress) === '0x1') return '0x1';

  // Ensure the address has an even length (excluding the '0x' prefix)
  if (fAddress.length % 2 !== 0) {
    fAddress = `0x0${fAddress.slice(2)}`;
  }

  // Convert the address to a byte array
  let addressBytes = arrayify(fAddress);
  // If the byte length is less than 32 bytes, pad the beginning with zeros
  if (addressBytes.length < 32) {
    const padding = new Uint8Array(32 - addressBytes.length);
    addressBytes = new Uint8Array([...padding, ...addressBytes]);
  }
  fAddress = hexlify(addressBytes);
  return fAddress;
}

export function formatEvmAddress(address: string) {
  assertEvmAddress(address);
  return getAddress(address.toLowerCase());
}

export function formatSolanaAddress(address: string) {
  assertSolanaAddress(address);
  return address;
}

export function formatSeiAddress(address: string) {
  assertSeiAddress(address);
  return address.toLowerCase();
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
