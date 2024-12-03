import { ID } from '../../utils/sui/types/id';
import { LpPosition } from '../cetus/types';

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

export type PositionCap = {
  id: ID;
  position_id: string;
};

export type Position = {
  id: ID;
  col_x: string;
  col_y: string;
  config_id: string;
  debt_bag: {
    type: string;
    fields: {
      facil_id: string;
      id: ID;
      inner: {
        type: string;
        fields: {
          id: ID;
          bag: {
            fields: {
              id: ID;
              size: string;
            };
            type: string;
          };
          infos: {
            type: string;
            fields: {
              amount: string;
              asset_type: {
                type: string;
                fields: {
                  name: string;
                };
              };
              share_type: {
                type: string;
                fields: {
                  name: string;
                };
              };
            };
          }[];
        };
      };
    };
  };
  lp_position: LpPosition;
  ticket_active: boolean;
  version: number;
};

export type PositionConfig = {
  allow_new_positions: boolean;
  base_deleverage_factor_bps: number;
  base_liq_factor_bps: number;
  current_global_l: string;
  deleverage_margin_bps: number;
  id: ID;
  lend_facil_cap: {
    type: string;
    fields: {
      id: ID;
    };
  };
  liq_bonus_bps: number;
  liq_fee_bps: number;
  liq_margin_bps: number;
  max_global_l: string;
  max_position_l: string;
  min_init_margin_bps: number;
  min_liq_start_price_delta_bps: number;
  pool_object_id: string;
  position_creation_fee_sui: string;
  rebalance_fee_bps: number;
  version: number;
};

export type SupplyPool = {
  available_balance: string;
  id: ID;
  debt_info: {
    type: string;
    fields: {
      contents: {
        fields: {
          key: string;
          value: {
            type: string;
            fields: {
              debt_registry: {
                type: string;
                fields: {
                  liability_value_x64: string;
                  supply_x64: string;
                };
              };
              max_liability_outstanding: string;
              max_utilization_bps: string;
            };
          };
        };
        type: string;
      }[];
    };
  };
  last_update_ts_sec: string;
};
