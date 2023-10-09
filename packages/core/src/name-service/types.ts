import { AddressSystemType } from '../Address';
import { NetworkIdType } from '../Network';

export type NSOwner = {
  address: string;
  addressSystem: AddressSystemType;
};

export type NameChecker = {
  addressSystem: AddressSystemType;
  networkId?: NetworkIdType;
  checker: (name: string) => boolean;
};
