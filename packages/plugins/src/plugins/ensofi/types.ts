import { ID } from '../../utils/sui/structs/id';

export type Offer = {
  amount: string;
  asset_tier: string;
  duration: string;
  id: ID;
  interet: string;
  lender: string;
  status: string;
};

export type Loan = {
  id: ID;
  amount: string;
  borrower: string;
  collateral: string;
  duration: string;
  interest: string;
  lender: string;
  offer_id: string;
  repay_balance: string;
  start_timestamp: string;
  status: string;
};
