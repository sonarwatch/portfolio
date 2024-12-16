export type Portfolio = {
  collaterals: {
    indexes: {
      handle: string;
    };
    items: string[];
    keys: {
      item_table: {
        handle: string;
      };
      items: {
        account_address: string;
        module_name: string;
        struct_name: string;
      }[];
    };
  };
  liabilities: {
    indexes: {
      handle: string;
    };
    items: string[];
    keys: {
      item_table: {
        handle: string;
      };
      items: {
        account_address: string;
        module_name: string;
        struct_name: string;
      }[];
    };
  };
};

export type Broker = {
  available: string;
  borrowed: string;
  interest_rate_curve: {
    r0: string;
    r1: string;
    r2: string;
    r3: string;
    u1: string;
    u2: string;
  };
  interest_updated_at: string;
  is_borrow_paused: boolean;
  is_lend_paused: boolean;
  is_paused: boolean;
  is_redeem_paused: boolean;
  is_repay_paused: boolean;
  max_borrow: string;
  max_deposit: string;
};
