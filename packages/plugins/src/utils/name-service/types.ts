import { AddressSystemType, NetworkIdType } from '@sonarwatch/portfolio-core';

export type NSName = {
  name: string;
  networkId: NetworkIdType;
};

export type NSOwner = {
  address: string | null;
  addressSystem: AddressSystemType;
  networkId: NetworkIdType;
};
