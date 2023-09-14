import { ObjectContentFields } from "@mysten/sui.js";

export type BalanceSheet = {
  // [k in CoinNames]?: ObjectContentFields;
  [k in string]?: ObjectContentFields;
};

export type BorrowIndexes = {
  // [k in CoinNames]?: ObjectContentFields;
  [k in string]?: ObjectContentFields;
};

export type InterestModel = {
  // [k in CoinNames]?: ObjectContentFields;
  [k in string]?: ObjectContentFields;
};

export type InterestModelData = {
  base_borrow_rate_per_sec: {
    fields: {
      value: string;
    };
  };
  borrow_rate_on_high_kink: {
    fields: {
      value: string;
    };
  };
  borrow_rate_on_mid_kink: {
    fields: {
      value: string;
    };
  };
  borrow_weight: {
    fields: {
      value: string;
    };
  };
  high_kink: {
    fields: {
      value: string;
    };
  };
  interest_rate_scale: string;
  max_borrow_rate: {
    fields: {
      value: string;
    };
  };
  mid_kink: {
    fields: {
      value: string;
    };
  };
  min_borrow_amount: string;
  revenue_factor: {
    fields: {
      value: string;
    };
  };
  type: {
    fields: {
      name: string;
    };
  };
};

export type BorrowIndexData = {
  borrow_index: string;
  interest_rate: {
    fields: {
      value: string;
    };
  };
  interest_rate_scale: string;
  last_updated: string;
};

export type BalanceSheetData = {
  cash: string;
  debt: string;
  market_coin_supply: string;
  revenue: string;
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
  [k in MarketDataFieldsName]: object
} &
{
  vault: {
    type: string;
    fields: {
      [l in VaultFieldsName]: BasicField & WitTable;
    };
  };
  borrow_dynamics: BasicField & WitTable;
  interest_models: BasicField & WitTable;
};

export type MarketJobData = {
  coin: string;
  decimal: number;
  coinType: string;
  growthInterest: number;
  borrowInterestRate: number;
  supplyInterestRate: number;
  debt: number;
  cash: number;
  marketCoinSupply: number;
  reserve: number;
};

export type MarketJobResult = {
  [T in string]: MarketJobData
};

export type ObligationKeyFields = {
  id: IdField;
  ownership: BasicField & { fields: { id: IdField, of: string; }; };
};

type BalanceBag = BasicField & {
  fields: {
    id: IdField;
    bag: BasicField & { fields: { id: IdField; size: string; }; };
  };
};

export type ObligationAccount = {
  balances: BalanceBag,
  borrow_locked: boolean;
  collaterals: WitTable;
  debts: WitTable;
  deposit_collateral_locked: boolean;
  id: IdField;
  liquidate_locked: boolean;
  lock_key: string | null;
  repay_locked: boolean;
  rewards_point: string;
  withdraw_collateral_locked: boolean;
};
