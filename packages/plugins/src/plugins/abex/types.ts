export type Credential = {
  acc_reward_per_share: string;
  id: {
    id: string;
  };
  lock_until: string;
  stake: string;
};

export type AlpMarket = {
  fun_mask: string;
  id: {
    id: string;
  };
  lp_supply: {
    type: string;
    fields: { value: string };
  };
};

export type Market = {
  id: {
    id: string;
  };
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
