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

export function uniformBitcoinAddress(address: string) {
  assertBitcoinAddress(address);
  return address;
}

export function uniformMoveAddress(address: string) {
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

export function uniformEvmAddress(address: string) {
  assertEvmAddress(address);
  return getAddress(address.toLowerCase());
}

export function uniformSolanaAddress(address: string) {
  assertSolanaAddress(address);
  return address;
}

export function uniformSeiAddress(address: string) {
  assertSeiAddress(address);
  return address.toLowerCase();
}

const uniformers: Record<AddressSystemType, (address: string) => string> = {
  [AddressSystem.solana]: uniformSolanaAddress,
  [AddressSystem.bitcoin]: uniformBitcoinAddress,
  [AddressSystem.evm]: uniformEvmAddress,
  [AddressSystem.move]: uniformMoveAddress,
  [AddressSystem.sei]: uniformSeiAddress,
};

export function uniformAddress(
  address: string,
  addressSystem: AddressSystemType
) {
  const uniformer = uniformers[addressSystem];
  return uniformer(address);
}

export function uniformAddressByNetworkId(
  address: string,
  networkId: NetworkIdType
) {
  const network = networks[networkId];
  if (!network) throw new Error(`NetworkId not supported: ${networkId}`);
  return uniformAddress(address, network.addressSystem);
}
