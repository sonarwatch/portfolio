import { ID } from '../../utils/sui/types/id';

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

export type LoanOfferAccount = {
  tierId: string;
  lendOfferId: string;
  interest: number;
  borrowAmount: string;
  lenderFeePercent: number;
  duration: string;
  lendMintToken: string;
  lender: string;
  offerId: string;
  borrower: string;
  collateralMintToken: string;
  collateralAmount: string;
  requestWithdrawAmount?: string;
  status: LoanOfferStatus;
  borrowerFeePercent: number;
  startedAt: string;
  liquidatingAt?: string;
  liquidatingPrice?: string;
  liquidatedTx?: string;
  liquidatedPrice?: string;
};

type LoanOfferStatus = {
  matched?: string;
  fundTransferred?: string;
  repay?: string;
  borrowerPaid?: string;
  liquidating?: string;
  liquidated?: string;
  finished?: string;
};

export type LendOfferAccount = {
  interest: number;
  lenderFeePercent: number;
  duration: string;
  offerId: string;
  lender: string;
  lendMintToken: string;
  amount: string;
  status: LendOfferStatus;
};

type LendOfferStatus = {
  created?: string;
  canceling?: string;
  canceled?: string;
  loaned?: string;
};
