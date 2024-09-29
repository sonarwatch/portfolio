import { ID } from '../../utils/sui/structs/id';

export type Credential = {
  acc_reward_per_share: string;
  id: ID;
  lock_until: string;
  stake: string;
};

export type Pool = {
  acc_reward_per_share: string;
  enabled: boolean;
  end_time: string;
  id: ID;
  last_updated_time: string;
  lock_duration: string;
  reward: string;
  staked_amount: string;
  start_time: string;
};

export type AlpMarket = {
  fun_mask: string;
  id: ID;
  lp_supply: {
    type: string;
    fields: { value: string };
  };
};

export type Market = {
  id: ID;
  name: {
    type: string;
    fields: {
      dummy_field: boolean;
    };
  };
  value: {
    type: string;
    fields: MarketFields;
  };
};

export type MarketFields = {
  acc_reserving_rate: {
    type: string;
    fields: {
      value: string;
    };
  };
  enabled: boolean;
  last_update: string;
  liquidity: string;
  price_config: {
    type: string;
    fields: {
      feeder: string;
      max_confidence: string;
      max_interval: string;
      precision: string;
    };
  };
  reserved_amount: string;
  reserving_fee_model: string;
  unrealised_reserving_fee_amount: {
    type: string;
    fields: {
      value: string;
    };
  };
  weight: {
    type: string;
    fields: {
      value: string;
    };
  };
};
