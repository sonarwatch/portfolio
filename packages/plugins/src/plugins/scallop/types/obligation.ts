import { BasicField, IdField, NameField } from './basic';

export type ObligationKeyFields = {
  id: IdField;
  ownership: BasicField & { fields: { id: IdField; of: string } };
};

export type ObligationFields = {
  balances: BasicField<{
    id: IdField;
    bag: BasicField<{ id: IdField; size: string }>;
  }> & {
    borrow_locked: boolean;
  };
  collaterals: BasicField & {
    fields: {
      id: IdField;
      keys: BasicField<{
        contents: Array<BasicField<{ name: string }>>;
      }>;
      table: BasicField<{ id: IdField; size: string }>;
      with_keys: boolean;
    };
  };
  debts: BasicField<{
    id: IdField;
    keys: BasicField<{ contents: Array<BasicField<{ name: string }>> }>;
    table: BasicField<{ id: IdField; size: string }>;
    with_keys: boolean;
  }>;
  deposit_collateral_locked: boolean;
  id: IdField;
  liquidate_locked: boolean;
  lock_key: BasicField<{ name: string }>;
  repay_locked: boolean;
  rewards_point: string;
  withdraw_collateral_locked: boolean;
};

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
