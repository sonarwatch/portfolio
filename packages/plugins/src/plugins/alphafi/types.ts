import BigNumber from 'bignumber.js';

export type Receipt = {
  id: {
    id: string;
  };
  image_url: string;
  last_acc_reward_per_xtoken: {
    fields: {
      contents: {
        fields: {
          key: {
            fields: {
              name: string;
            };
            type: string;
          };
          value: string;
        };
        type: string;
      }[];
      type: string;
    };
  };
  locked_balance: {
    fields: {
      head: string;
      id: {
        id: string;
      };
      size: string;
      tail: string;
    };
  };
  name: string;
  owner: string;
  pending_rewards: {
    fields: {
      contents: {
        fields: {
          key: {
            fields: {
              name: string;
            };
            type: string;
          };
          value: string;
        };
        type: string;
      }[];
      type: string;
    };
  };
  pool_id: string;
  unlocked_xtokens: string;
  xTokenBalance: string;
};

export type Pool = {
  acc_rewards_per_xtoken: {
    fields: {
      contents: {
        key: {
          fields: {
            name: string;
          };
          type: string;
        };
        value: string;
        type: string;
      }[];
    };
    type: string;
  };
  alpha_bal: string;
  deposit_fee: string;
  deposit_fee_max_cap: string;
  id: {
    id: string;
  };
  image_url: number[]; // Array of numbers (ASCII values)
  instant_withdraw_fee: string;
  instant_withdraw_fee_max_cap: string;
  locked_period_in_ms: string;
  locking_start_ms: string;
  name: number[]; // Array of numbers (ASCII values)
  paused: boolean;
  performance_fee: string;
  performance_fee_max_cap: string;
  rewards: {
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
    type: string;
  };
  tokensInvested: string;
  withdraw_fee_max_cap: string;
  withdrawal_fee: string;
  xTokenSupply: string;
};

export type Balance = {
  coinType: string;
  balance: BigNumber;
  locked?: boolean;
};
