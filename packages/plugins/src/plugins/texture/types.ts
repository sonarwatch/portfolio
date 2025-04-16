export type Loan = {
  borrower_owner: string;
  collateral: number;
  duration: number;
  end_time: number;
  lender_owner: string;
  loan: string;
  pair: string;
  principal: number;
  repayment: number;
  start_time: number;
  status: string;
};

export type Offer = {
  offer: string;
  pair: string;
  duration: number;
  principal: number;
  remaining_principal: number;
};

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
