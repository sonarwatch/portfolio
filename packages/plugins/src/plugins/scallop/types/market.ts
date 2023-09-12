import { ObjectContentFields } from "@mysten/sui.js";
import { CoinNames } from "./coin";

export type BalanceSheet = {
  [k in CoinNames]?: ObjectContentFields;
};

const MARKET_DATA_FIELDS = [
  'asset_active_states',
  'borrow_dynamics',
  'collateral_stats',
  'id',
  'interest_models',
  'limiters',
  'reward_factors',
  'risk_models',
  'vault',
] as const;

const VAULT_FIELDS = [
  'balance_sheets',
  'flash_loan_fees',
  'id',
  'market_coin_supplies',
  'underlying_balances'
] as const;

type BasicField = {
  type: string;
  fields: object;
};

type IdField = {
  id: string;
};

type NameField = {
  name: string;
};

type ContentFields = {
  contents: (BasicField & { fields: NameField; })[];
};

type WitTable = {
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

export type MarketDataFieldsName = (typeof MARKET_DATA_FIELDS)[number];
export type VaultFieldsName = (typeof VAULT_FIELDS)[number];

export type MarketData = {
  vault: {
    type: string;
    fields: {
      [k in VaultFieldsName]: object;
    } & { balance_sheets: BasicField & WitTable; };
  };
};
