/**
 * Asserts that the given address system is valid.
 *
 * @param addressSystem - The address system to be validated.
 * @returns The validated address system.
 * @throws Error if the address system is not valid.
 */
import { AddressSystemType } from '../Address';
import { AddressSystemIsNotValidError } from '../errors';
import { getAddressSystemFromString } from './getAddressSystemFromString';

export function assertAddressSystemFromString(
  addressSystem: string
): AddressSystemType {
  const rAddressSystem = getAddressSystemFromString(addressSystem);
  if (rAddressSystem) return rAddressSystem;
  throw new AddressSystemIsNotValidError(addressSystem);
}
