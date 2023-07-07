import { PublicKey } from '@solana/web3.js';
import { validate, Network } from 'bitcoin-address-validation';
import { isAddress as isAddressEthers } from '@ethersproject/address';
import { isHexString } from '@ethersproject/bytes';
import { NetworkIdType } from '../Network';
import { AddressSystem, AddressSystemType } from '../Address';
import { networks } from '../constants';

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

const validators: Record<AddressSystemType, (address: string) => boolean> = {
  [AddressSystem.solana]: isSolanaAddress,
  [AddressSystem.evm]: isEvmAddress,
  [AddressSystem.bitcoin]: isBitcoinAddress,
  [AddressSystem.move]: isMoveAddress,
};

export function isAddress(address: string, networkId: NetworkIdType): boolean {
  const network = networks[networkId];
  if (!network) throw new Error(`NetworkId not supported: ${networkId}`);

  const validator = validators[network.addressSystem];
  return validator(address);
}

export function assertAddressValid(
  address: string,
  networkId: NetworkIdType
): void {
  if (!isAddress(address, networkId))
    throw new Error(`Address is not valid: [${networkId}][${address}]`);
}
