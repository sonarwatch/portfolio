import { AddressSystem, AddressSystemType } from '../Address';

export function assertAddressSystem(addressSystem: string): AddressSystemType {
  if (addressSystem in AddressSystem) return addressSystem as AddressSystemType;
  throw new Error(`Address system is not valid: ${addressSystem}`);
}
