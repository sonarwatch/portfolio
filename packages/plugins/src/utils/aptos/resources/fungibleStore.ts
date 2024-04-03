import { MoveResource } from '../MoveResource';

export type FungibleStoreResource = MoveResource<FungibleStore>;

export type FungibleStore = {
  balance: string;
  frozen: boolean;
  metadata: Metadata;
};

export type Metadata = {
  inner: string;
};
