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
