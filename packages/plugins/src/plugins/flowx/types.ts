import { ID } from '../../utils/sui/types/id';

export type StakingPosition = {
  id: {
    id: string;
  };
  name: string;
  value: {
    type: string;
    fields: {
      amount: string;
      flx_pending: string;
      sui_pending: string;
      last_settled_epoch: string;
    };
  };
};

export type UnstakingPositionObject = {
  balance: string;
  unlocked_at_epoch: string;
};

export type PositionObject = {
  amount: string;
  flx_reward_debt: string;
  id: ID;
  pool_idx: string;
  token_reward_debt: string;
};

export type PairObject = {
  value: {
    type: string;
    fields: PairObjectFields;
  };
};

export type PairObjectFields = {
  coinType: string | null;
  lp_supply: {
    type: string;
    fields: {
      value: string;
    };
  };
  reserve_x: {
    type: string;
    coinType: string | null;
    fields: {
      value: string;
      balance: string;
    };
  };
  reserve_y: {
    type: string;
    coinType: string | null;
    fields: {
      value: string;
      balance: string;
    };
  };
};

export type PoolObject = {
  name: string;
  value: {
    type: string;
    fields: PoolObjectFields;
  };
};

export type PoolObjectFields = {
  lp_custodian: {
    type: string;
  };
  reward_token_custodian: {
    type: string;
  };
};

export type Pool = {
  lpToken: string;
  rewardToken: string;
};

export type PositionV3Object = {
  coin_type_x: {
    fields: {
      name: string;
    };
  };
  coin_type_y: {
    fields: {
      name: string;
    };
  };
  pool_id: string;
  liquidity: string;
  tick_lower_index: {
    fields: {
      bits: string;
    };
  };
  tick_upper_index: {
    fields: {
      bits: string;
    };
  };
};

export type PoolV3 = {
  tick_index: {
    fields: {
      bits: string;
    };
  };
};
