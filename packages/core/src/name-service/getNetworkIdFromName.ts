import { AddressSystemType } from '../Address';
import { NameIsNotValidError } from '../errors';
import { nameCheckers } from './nameCheckers';

export function getAddressSystemFromName(
  name: string
): AddressSystemType | null {
  for (let i = 0; i < nameCheckers.length; i++) {
    const nameChecker = nameCheckers[i];
    if (nameChecker.checker(name)) return nameChecker.addressSystem;
  }
  return null;
}

export function assertAddressSystemFromName(name: string): AddressSystemType {
  const addressSystem = getAddressSystemFromName(name);
  if (!addressSystem) throw new NameIsNotValidError(name);
  return addressSystem;
}

export function isNameValid(name: string): boolean {
  return getAddressSystemFromName(name) !== null;
}
