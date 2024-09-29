import { ID } from '../../utils/sui/structs/id';

export interface Vault {
  free_balance: string;
  id: ID;
  lp_treasury: {
    type: string;
    fields: {
      id: ID;
      total_supply: {
        type: string;
        fields: {
          value: string;
        };
      };
    };
  };
  performance_fee_balance: string;
  performance_fee_bps: string;
  profit_unlock_duration_sec: string;
  strategies: {
    type: string;
    fields: {
      contents: {
        type: string;
        fields: {
          key: string;
          value: {
            type: string;
            fields: {
              borrowed: string;
              max_borrow: null;
              target_alloc_weight_bps: string;
            };
          };
        };
      }[];
    };
  };
  strategy_withdraw_priority_order: string[];
  time_locked_profit: {
    type: string;
    fields: {
      final_unlock_ts_sec: string;
      locked_balance: string;
      previous_unlock_at: string;
      unlock_per_second: string;
      unlock_start_ts_sec: string;
      unlocked_balance: string;
    };
  };
  tvl_cap: null;
  version: string;
  withdraw_ticket_issued: boolean;
}
