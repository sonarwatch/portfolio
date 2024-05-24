export type ReserveData = {
  id: {
    id: string;
  };
  name: number;
  value: {
    type: string;
    fields: {
      borrow_balance: Balance;
      borrow_cap_ceiling: string;
      borrow_rate_factors: {
        type: string;
        fields: {
          base_rate: string;
          jump_rate_multiplier: string;
          multiplier: string;
          optimal_utilization: string;
          reserve_factor: string;
        };
      };
      coin_type: string;
      current_borrow_index: string;
      current_borrow_rate: string;
      current_supply_index: string;
      current_supply_rate: string;
      id: number;
      is_isolated: boolean;
      last_update_timestamp: string;
      liquidation_factors: {
        type: string;
        fields: {
          bonus: string;
          ratio: string;
          threshold: string;
        };
      };
      ltv: string;
      oracle_id: number;
      reserve_field_a: string;
      reserve_field_b: string;
      reserve_field_c: string;
      supply_balance: Balance;
      supply_cap_ceiling: string;
      treasury_balance: string;
      treasury_factor: string;
    };
  };
};

export type Balance = {
  type: string;
  fields: {
    total_supply: string;
    user_state: {
      type: string;
      fields: {
        id: {
          id: string;
        };
        size: string;
      };
    };
  };
};

export type BalanceData = {
  id: {
    id: string;
  };
  name: string;
  value: string;
};
