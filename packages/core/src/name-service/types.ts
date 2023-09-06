import { AddressSystemType } from '../Address';
import { NetworkIdType } from '../Network';

export type NSName = {
  name: string;
  networkId: NetworkIdType;
};

export type NSOwner = {
  address: string | null;
  addressSystem: AddressSystemType;
  networkId: NetworkIdType;
};
