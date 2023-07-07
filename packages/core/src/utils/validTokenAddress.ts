import { NetworkIdType } from '../Network';
import { AddressSystem, AddressSystemType } from '../Address';
import { bitcoinNativeAddress, networks } from '../constants';
import { isEvmAddress, isSolanaAddress } from './validAddress';

export function isBitcoinTokenAddress(address: string): boolean {
  return address === bitcoinNativeAddress;
}
export function assertBitcoinTokenAddress(address: string): void {
  if (!isBitcoinTokenAddress(address))
    throw new Error(`Bitcoin token address is not valid: ${address}`);
}

export function isEvmTokenAddress(address: string): boolean {
  return isEvmAddress(address);
}
export function assertEvmTokenAddress(address: string): void {
  if (!isEvmTokenAddress(address))
    throw new Error(`Evm token address is not valid: ${address}`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isMoveTokenAddress(address: string): boolean {
  return true;
}
export function assertMoveTokenAddress(address: string): void {
  if (!isMoveTokenAddress(address))
    throw new Error(`Move token address is not valid: ${address}`);
}

export function isSolanaTokenAddress(address: string): boolean {
  return isSolanaAddress(address);
}
export function assertSolanaTokenAddress(address: string): void {
  if (!isSolanaTokenAddress(address))
    throw new Error(`Solana token address is not valid: ${address}`);
}

const validators: Record<AddressSystemType, (address: string) => boolean> = {
  [AddressSystem.solana]: isSolanaTokenAddress,
  [AddressSystem.evm]: isEvmTokenAddress,
  [AddressSystem.bitcoin]: isBitcoinTokenAddress,
  [AddressSystem.move]: isMoveTokenAddress,
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
