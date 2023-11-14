import { BasicField, IdField, NameField } from './basic';

export type DebtAsset = {
  id: IdField;
  name: BasicField & { fields: NameField };
  value: BasicField & {
    fields: {
      amount: string;
      borrow_index: string;
    };
  };
};

export type CollateralAsset = {
  id: IdField;
  name: BasicField & { fields: NameField };
  value: BasicField & { fields: { amount: string } };
};
