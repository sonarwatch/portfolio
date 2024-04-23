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
    };
  };
};

export type PositionObject = {
  amount: string;
  flx_reward_debt: string;
  id: {
    id: string;
  };
  pool_idx: string;
  token_reward_debt: string;
};

export type PairObject = {
  value: {
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
    fields: {
      lp_custodian: {
        type: string;
      };
      reward_token_custodian: {
        type: string;
      };
    };
  };
};

export type Pool = {
  lpToken: string;
  rewardToken: string;
}

export type Pools = {
  [T in string]: Pool;
};

