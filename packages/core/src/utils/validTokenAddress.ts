import { NetworkIdType } from '../Network';
import { AddressSystem, AddressSystemType } from '../Address';
import { bitcoinNativeAddress, networks } from '../constants';
import { isEvmAddress, isMoveAddress, isSolanaAddress } from './validAddress';
import { TokenAddressIsNotValideError } from '../errors';
import { parseTypeString } from './move';

export function isBitcoinTokenAddress(address: string): boolean {
  return address === bitcoinNativeAddress;
}
export function assertBitcoinTokenAddress(address: string): void {
  if (!isBitcoinTokenAddress(address))
    throw new TokenAddressIsNotValideError(address, AddressSystem.bitcoin);
}

export function isEvmTokenAddress(address: string): boolean {
  return isEvmAddress(address);
}
export function assertEvmTokenAddress(address: string): void {
  if (!isEvmTokenAddress(address))
    throw new TokenAddressIsNotValideError(address, AddressSystem.evm);
}

export function isMoveTokenAddress(address: string): boolean {
  try {
    parseTypeString(address);
  } catch (e) {
    return false;
  }

  let splitted = address.split('::');
  if (splitted.length < 3) splitted = address.split('-');
  if (splitted.length < 3) return false;

  const mainAddress = splitted.at(0);
  if (!mainAddress) return false;
  if (!isMoveAddress(mainAddress)) return false;
  return true;
}
export function assertMoveTokenAddress(address: string): void {
  if (!isMoveTokenAddress(address))
    throw new TokenAddressIsNotValideError(address, AddressSystem.move);
}

export function isSolanaTokenAddress(address: string): boolean {
  return isSolanaAddress(address);
}
export function assertSolanaTokenAddress(address: string): void {
  if (!isSolanaTokenAddress(address))
    throw new TokenAddressIsNotValideError(address, AddressSystem.solana);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isSeiTokenAddress(address: string): boolean {
  return true;
}
export function assertSeiTokenAddress(address: string): void {
  if (!isSeiTokenAddress(address))
    throw new TokenAddressIsNotValideError(address, AddressSystem.sei);
}

const validators: Record<AddressSystemType, (address: string) => boolean> = {
  [AddressSystem.solana]: isSolanaTokenAddress,
  [AddressSystem.evm]: isEvmTokenAddress,
  [AddressSystem.bitcoin]: isBitcoinTokenAddress,
  [AddressSystem.move]: isMoveTokenAddress,
  [AddressSystem.sei]: isSeiTokenAddress,
};

export function isTokenAddressValid(
  address: string,
  networkId: NetworkIdType
): boolean {
  const network = networks[networkId];
  if (!network) throw new Error(`NetworkId not supported: ${networkId}`);

  const validator = validators[network.addressSystem];
  return validator(address);
}

export function assertTokenAddressValid(
  address: string,
  networkId: NetworkIdType
): void {
  if (!isTokenAddressValid(address, networkId))
    throw new Error(`Address is not valid: [${networkId}][${address}]`);
}
