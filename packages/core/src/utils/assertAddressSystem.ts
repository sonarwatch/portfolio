/**
 * Asserts that the given address system is valid.
 *
 * @param addressSystem - The address system to be validated.
 * @returns The validated address system.
 * @throws Error if the address system is not valid.
 */
import { AddressSystem, AddressSystemType } from '../Address';

export function assertAddressSystem(addressSystem: string): AddressSystemType {
  if (addressSystem in AddressSystem) return addressSystem as AddressSystemType;
  throw new Error(`Address system is not valid: ${addressSystem}`);
}
