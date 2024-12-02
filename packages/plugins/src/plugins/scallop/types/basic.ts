import { ID } from '../../../utils/sui/types/id';

export type BasicField = {
  type: string;
  fields: object;
};

export type IdField = ID;

export type NameField = {
  name: string;
};

export type ContentFields = {
  contents: (BasicField & { fields: NameField })[];
};

export type WitTable = {
  fields: {
    id: IdField;
    keys: BasicField & { fields: ContentFields };
    table: BasicField & {
      fields: { id: IdField };
      size: string;
    };
    with_keys: boolean;
  };
};

export type ExtendedBasicField<T> = {
  type: string;
  fields: T;
};
