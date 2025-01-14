import { ID } from '../../../utils/sui/types/id';

export type BasicField<T = string> = {
  type: string;
  fields: T;
};

export type NameField = {
  name: string;
};

export type WitTable = {
  id: ID;
  keys: BasicField<{ contents: Array<BasicField<NameField>> }>;
  table: BasicField<{ id: ID }> & {
    size: string;
  };
  with_keys: boolean;
};

export type BalanceBag = BasicField<{
  id: ID;
  bag: BasicField<{ id: ID; size: string }>;
}>;

export type Ownership = BasicField<{ id: ID; of: string }>;
