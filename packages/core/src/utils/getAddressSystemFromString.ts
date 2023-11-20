import { AddressSystem, AddressSystemType } from '../Address';

export function getAddressSystemFromString(
  addressSystem: string
): AddressSystemType | null {
  if (addressSystem in AddressSystem) return addressSystem as AddressSystemType;
  return null;
}
