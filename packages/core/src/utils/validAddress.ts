import { validate, Network } from 'bitcoin-address-validation';
import { isAddress as isAddressEthers } from '@ethersproject/address';
import { isHexString } from '@ethersproject/bytes';
import { base58 } from '@metaplex-foundation/umi-serializers-encodings';
import { AddressSystem, AddressSystemType } from '../Address';
import { AddressIsNotValidError } from '../errors/AddressIsNotValidError';

export function isBitcoinAddress(address: string): boolean {
  return validate(address, Network.mainnet);
}
export function assertBitcoinAddress(address: string): void {
  if (!isBitcoinAddress(address))
    throw new AddressIsNotValidError(address, AddressSystem.bitcoin);
}

export function isEvmAddress(address: string): boolean {
  if (!address.startsWith('0x')) return false;
  return isAddressEthers(address.toLocaleLowerCase());
}
export function assertEvmAddress(address: string): void {
  if (!isEvmAddress(address))
    throw new AddressIsNotValidError(address, AddressSystem.evm);
}

export function isMoveAddress(address: string): boolean {
  return isHexString(address, 32);
}
export function assertMoveAddress(address: string): void {
  if (!isMoveAddress(address))
    throw new AddressIsNotValidError(address, AddressSystem.move);
}

export function isSolanaAddress(address: string): boolean {
  if (
    // Lowest address (32 bytes of zeroes)
    address.length < 32 ||
    // Highest address (32 bytes of 255)
    address.length > 44
  ) {
    return false;
  }
  // Slow-path; actually attempt to decode the input string.

  try {
    const bytes = base58.serialize(address);
    const numBytes = bytes.byteLength;
    if (numBytes !== 32) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
export function assertSolanaAddress(address: string): void {
  if (!isSolanaAddress(address))
    throw new AddressIsNotValidError(address, AddressSystem.solana);
}

export function isSeiAddress(address: string): boolean {
  return address.startsWith('sei');
}
export function assertSeiAddress(address: string): void {
  if (!isSeiAddress(address))
    throw new AddressIsNotValidError(address, AddressSystem.sei);
}

const validators: Record<AddressSystemType, (address: string) => boolean> = {
  [AddressSystem.solana]: isSolanaAddress,
  [AddressSystem.evm]: isEvmAddress,
  [AddressSystem.move]: isMoveAddress,
  [AddressSystem.bitcoin]: isBitcoinAddress,
  [AddressSystem.sei]: isSeiAddress,
};

export function getAddressSystem(address: string): AddressSystemType | null {
  for (const [addressSystem, validator] of Object.entries(validators)) {
    if (validator(address)) return addressSystem as AddressSystemType;
  }
  return null;
}

export function getAddressSystemOrFail(address: string): AddressSystemType {
  const addressSystem = getAddressSystem(address);
  if (!addressSystem) throw new AddressIsNotValidError(address);
  return addressSystem;
}

export function isAddress(
  address: string,
  addressSystem: AddressSystemType
): boolean {
  const validator = validators[addressSystem];
  return validator(address);
}

export function assertAddress(
  address: string,
  addressSystem: AddressSystemType
): void {
  if (!isAddress(address, addressSystem))
    throw new AddressIsNotValidError(address, addressSystem);
}
