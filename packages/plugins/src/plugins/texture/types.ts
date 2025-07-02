export type Pair = {
  pair: string;
  duration: number;
  lender_apr_percent: string;
  collateral_token: {
    mint: string;
  };
  principal_token: {
    mint: string;
  };
};

export type ReserveInfo = {
  pubkey: string;
  exchange_rate: number;
  mint: string;
};
