export type UserVault = {
  collaterals: {
    data: Collateral[];
  };
  efficiency_mode_id: number;
  liabilities: {
    data: Liability[];
  };
};

export type Collateral = {
  key: {
    inner: string;
  };
  value: string;
};

export type Liability = {
  key: {
    inner: string;
  };
  value: {
    interest_accumulated: string;
    last_interest_rate_index: {
      v: string;
    };
    principal: string;
  };
};

export type CoinInfo = {
  type_name: string;
};

export type Market = {
  market: string;
  supplyApr: number;
  borrowApr: number;
  coinType: string;
  collateralFactor: number;
};
