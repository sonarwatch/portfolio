export type BasicField = {
  type: string;
  fields: object;
};

export type IdField = {
  id: string;
};

export type NameField = {
  name: string;
};

export type ContentFields = {
  contents: (BasicField & { fields: NameField; })[];
};

export type WitTable = {
  fields: {
    id: IdField;
    keys: BasicField & { fields: ContentFields; };
    table: BasicField & {
      fields: { id: IdField; },
      size: string;
    };
    with_keys: boolean;
  };
};
