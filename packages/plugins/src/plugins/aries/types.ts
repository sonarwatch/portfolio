import { BorrowLendRate } from '@sonarwatch/portfolio-core';

export type ProfilesSummary = {
  profile_signers: {
    data: [
      {
        key: string;
        value: {
          account: string;
        };
      }
    ];
  };
};

export type Profile = {
  borrow_farms: ProfileSub;
  borrowed_reserves: ProfileSub;
  deposit_farms: ProfileSub;
  deposited_reserves: ProfileSub;
};

export type ProfileVec = {
  account_address: string;
  module_name: string;
  struct_name: string;
};

export type ProfileSub = {
  head: {
    vec: ProfileVec[];
  };
  inner: {
    inner: {
      handle: string;
    };
    length: string;
  };
  tail: {
    vec: ProfileVec[];
  };
};

export type ProfileDepositItem = {
  next: {
    vec: [ProfileVec] | [];
  };
  prev: {
    vec: [ProfileVec] | [];
  };
  val: {
    collateral_amount: string;
  };
};

export type ProfileBorrowItem = {
  next: {
    vec: [ProfileVec] | [];
  };
  prev: {
    vec: [ProfileVec] | [];
  };
  val: {
    borrowed_share: { val: string };
  };
};

export type ReserveResponse = {
  result: {
    data: {
      id: string;
      meta: {
        module: string;
        owner: string;
        version: number;
        timestamp: string;
      };
      stats: Reserve[];
    };
  };
};
export type Reserve = {
  key: string;
  value: ReserveData;
};

export type ReserveEnhanced = Reserve & { rate: BorrowLendRate };

export type ReserveData = {
  initial_exchange_rate: number;
  reserve_amount: number;
  total_borrowed: number;
  total_borrowed_share: number;
  total_cash_available: number;
  total_lp_supply: number;
  reserve_config: ReserveConfig;
  interest_rate_config: InterestRateConfig;
};

export type InterestRateConfig = {
  min_borrow_rate: number;
  optimal_borrow_rate: number;
  max_borrow_rate: number;
  optimal_utilization: number;
};

export type ReserveConfig = {
  loan_to_value: number;
  liquidation_threshold: number;
  liquidation_bonus_bips: number;
  liquidation_fee_hundredth_bips: number;
  borrow_factor: number;
  reserve_ratio: number;
  borrow_fee_hundredth_bips: number;
  withdraw_fee_hundredth_bips: number;
  deposit_limit: number;
  borrow_limit: number;
  allow_collateral: boolean;
  allow_redeem: boolean;
  flash_loan_fee_hundredth_bips: number;
};
