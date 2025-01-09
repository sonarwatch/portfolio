import { ID } from '../../../utils/sui/types/id';
import {
  BalanceBag,
  BasicField,
  NameField,
  Ownership,
  WitTable,
} from './basic';

export type ObligationKeyFields = {
  id: ID;
  ownership: Ownership;
};

export type ObligationFields = {
  balances: BalanceBag & {
    borrow_locked: boolean;
  };
  collaterals: BasicField<WitTable>;
  debts: BasicField<WitTable>;
  deposit_collateral_locked: boolean;
  id: ID;
  liquidate_locked: boolean;
  lock_key: BasicField<NameField>;
  repay_locked: boolean;
  rewards_point: string;
  withdraw_collateral_locked: boolean;
};

export type DebtAsset = {
  id: ID;
  name: BasicField<NameField>;
  value: BasicField<{
    amount: string;
    borrow_index: string;
  }>;
};

export type CollateralAsset = {
  id: ID;
  name: BasicField<NameField>;
  value: BasicField<{ amount: string }>;
};
