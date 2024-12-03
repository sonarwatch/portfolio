import { ID } from '../../utils/sui/types/id';

export type Vault = {
  name: string;
  users: {
    fields: {
      id: {
        id: string;
      };
    };
  };
};

export type VaultAccount = {
  id: {
    id: string;
  };
  name: string;
  value: {
    fields: {
      amount_locked: string;
      pending_withdrawal: string;
    };
    type: string;
  };
};

export type Bank = {
  accounts: {
    fields: {
      id: {
        id: string;
      };
    };
    type: string;
  };
};

export type BankAccount = {
  id: {
    id: string;
  };
  name: string;
  value: {
    fields: {
      balance: string;
      owner: string;
    };
    type: string;
  };
};

export type PerpetualV2 = {
  id: {
    id: string;
  };
  name: string;
  positions: {
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
    type: string;
  };
  priceOracle: string;
};

export type UserPosition = {
  id: {
    id: string;
  };
  name: string;
  value: {
    fields: {
      isPosPositive: boolean;
      margin: string;
      mro: string;
      oiOpen: string;
      perpID: string;
      qPos: string;
      user: string;
    };
    type: string;
  };
};

export type PerpetualMeta = {
  symbol: string;
  perpetualAddress: {
    id: string;
    owner: string;
    dataType: string;
  };
};

export type ClmmPosition = {
  coin_type_a: string;
  coin_type_b: string;
  description: string;
  fee_growth_coin_a: string;
  fee_growth_coin_b: string;
  fee_rate: string;
  id: ID;
  liquidity: string;
  lower_tick: {
    fields: {
      bits: number;
    };
    type: string;
  };
  upper_tick: {
    fields: {
      bits: number;
    };
    type: string;
  };
  pool_id: string;
  position_index: string;
  reward_infos: {
    fields: {
      coins_owed_reward: string;
      reward_growth_inside_last: string;
    };
    type: string;
  }[];
  token_a_fee: string;
  token_b_fee: string;
};

export type ClmmPool = {
  coin_a: string;
  coin_b: string;
  current_sqrt_price: string;
  current_tick_index: {
    fields: {
      bits: number;
    };
    type: string;
  };
  fee_growth_global_coin_a: string;
  fee_growth_global_coin_b: string;
  fee_rate: string;
  id: ID;
  is_paused: boolean;
  liquidity: string;
  protocol_fee_coin_a: string;
  protocol_fee_coin_b: string;
  protocol_fee_share: string;
  reward_infos: {
    fields: {
      ended_at_seconds: string;
      last_update_time: string;
      reward_coin_decimals: number;
      reward_coin_symbol: string;
      reward_coin_type: string;
      reward_growth_global: string;
      reward_per_seconds: string;
      total_reward: string;
      total_reward_allocated: string;
    };
    type: string;
  }[];
};

export type ClmmPoolStat = {
  address: string;
  day: {
    volume: string;
  };
  feeRate: string;
  tvl: string;
};

export type AirdropResponse = {
  bluefinAddress: string;
  walletAddress: string;
  historicalBluePoints: string;
  lifeTimeSuiPoints: string;
  userTagIncentives: UserTagIncentive[];
  totalIncentives: string;
  userLeague: string;
  error?: {
    code: number;
    message: string;
  };
};

export type UserTagIncentive = {
  [key: string]: string;
};
