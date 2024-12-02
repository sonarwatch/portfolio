import { ID } from '../../utils/sui/types/id';

export type CollateralFields = {
  id: string;
  name: string;
  value: {
    type: string;
    fields: {
      next: string;
      prev: string;
      value: {
        type: string;
        fields: {
          buck_amount: string;
          collateral_amount: string;
          id: ID;
          reward_coll_snapshot: string;
          reward_debt_snapshot: string;
          stake_amount: string;
        };
      };
    };
  };
};

export type Flask = {
  id: ID;
  reserves: string;
  sbuck_supply: {
    fields: {
      value: string;
    };
    type: string;
  };
  version: string;
};

export type StakeProof = {
  id: ID;
  name: string;
  value: {
    fields: {
      fountain_id: string;
      id: ID;
      lock_until: string;
      stake_amount: string;
      stake_weight: string;
      start_uint: string;
    };
    type: string;
  }[];
};

export type BucketProtocol = {
  buck_treasury_cap: {
    fields: {
      ID: ID;
      total_supply: {
        fields: {
          value: string;
        };
        type: string;
      };
    };
    type: string;
  };
  id: ID;
  min_bottle_size: string;
  version: string;
};

export type BucketObject = {
  id: ID;
  base_fee_rate: string;
  bottle_table: {
    fields: {
      debt_per_unit_stake: string;
      id: ID;
      last_debt_error: string;
      last_reward_error: string;
      reward_per_unit_stake: string;
      table: {
        fields: {
          id: ID;
          head: string;
          size: string;
          tail: string;
        };
        type: string;
      };
      total_collateral_snapshot: string;
      total_stake: string;
      total_stake_snapshot: string;
    };
    type: string;
  };
  collateral_decimal: number;
  collateral_vault: string;
  latest_redemption_time: string;
  max_mint_amount: string;
  min_collateral_ratio: string;
  minted_buck_amount: string;
  recovery_mode_threshold: string;
  surplus_bottle_table: {
    fields: {
      id: ID;
      size: string;
    };
    type: string;
  };
  total_flash_loan_amount: string;
};

export type Bucket = {
  token: string;
  baseFeeRate: number;
  bottleTableSize: string;
  bottleTableId: string;
  collateralDecimal: number;
  collateralVault: string;
  latestRedemptionTime: number;
  minCollateralRatio: string;
  mintedBuckAmount: string;
  minBottleSize: string | undefined;
  maxMintAmount: string;
  recoveryModeThreshold: string;
};

export type PipeObject = {
  output_volume: string;
};

export type FountainStakeProof = {
  id: ID;
  name: string;
  value: {
    fields: {
      fountain_id: string;
      id: ID;
      strap_address: string;
    };
    type: string;
  }[];
};
