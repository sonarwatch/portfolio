import { PublicKey } from '@solana/web3.js';
import { validate, Network } from 'bitcoin-address-validation';
import { isAddress as isAddressEthers } from '@ethersproject/address';
import { isHexString } from '@ethersproject/bytes';
import { AddressSystem, AddressSystemType } from '../Address';

export function isBitcoinAddress(address: string): boolean {
  return validate(address, Network.mainnet);
}
export function assertBitcoinAddress(address: string): void {
  if (!isBitcoinAddress(address))
    throw new Error(`Bitcoin address is not valid: ${address}`);
}

export function isEvmAddress(address: string): boolean {
  if (!address.startsWith('0x')) return false;
  return isAddressEthers(address.toLocaleLowerCase());
}
export function assertEvmAddress(address: string): void {
  if (!isEvmAddress(address))
    throw new Error(`Evm address is not valid: ${address}`);
}

export function isMoveAddress(address: string): boolean {
  return isHexString(address, 32);
}
export function assertMoveAddress(address: string): void {
  if (!isMoveAddress(address))
    throw new Error(`Move address is not valid: ${address}`);
}

export function isSolanaAddress(address: string): boolean {
  if (address.length > 44) return false;
  try {
    // eslint-disable-next-line no-new
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}
export function assertSolanaAddress(address: string): void {
  if (!isSolanaAddress(address))
    throw new Error(`Solana address is not valid: ${address}`);
}

export function isSeiAddress(address: string): boolean {
  return address.startsWith('sei');
}
export function assertSeiAddress(address: string): void {
  if (!isSeiAddress(address))
    throw new Error(`Sei address is not valid: ${address}`);
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
  if (!addressSystem) throw new Error(`Address is not valid: ${address}`);
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
    throw new Error(`Address is not valid: [${addressSystem}][${address}]`);
}
