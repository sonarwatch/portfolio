import { BorrowLendRate } from '@sonarwatch/portfolio-core';

export type ProfileResponse = {
  result: {
    data: ProfileData;
  };
};

export type ProfileData = {
  profiles: {
    [accountName: string]: {
      id: string;
      meta: {
        module: string;
        owner: string;
        version: number;
        timestamp: string;
      };
      profileAddress: string;
      deposits: {
        [coin: string]: {
          collateral_amount: string;
          collateral_coins: string;
          collateral_value: string;
        };
      };
      borrows: {
        [coin: string]: {
          borrowed_amount: string;
          borrowed_coins: string;
          borrowed_value: string;
        };
      };
      equity: string;
      collateralValue: string;
      loanValue: string;
      riskFactor: string;
    };
  };
  total_equity: string;
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
