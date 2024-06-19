export type OfferType = {
  global?: string;
  mortgage?: string;
  borrow?: string;
};

export type Status = {
  waitingForBorrower?: string;
  waitingForLender?: string;
  repaid?: string;
  defaulted?: string;
  active?: string;
  onSale?: string;
};

export type Loan = {
  lender: string;
  borrower: string;
  mint: string;
  collectionConfig: string;
  status: Status;
  loanTerms: LoanTerms;
  creationTime: string;
  startTime: string;
  endTime: string;
  fox: boolean;
  mortgage: boolean;
  private: boolean;
  offerType: OfferType;
  listingPrice: string;
  ltvTerms: LtvTerms | null;
  pool: boolean;
  listedLoan: ListedLoan;
};

export type ListedLoan = {
  listed: boolean;
  price: string;
  sold: boolean;
  fox: boolean;
  listingTime: string;
};

export type LoanTerms = {
  apyBps: string;
  duration: string;
  principal: string;
};

export type LtvTerms = {
  ltvBps: string;
  maxOffer: string;
};

export type Collection = {
  id: string;
  name: string;
  floor: number;
  tProjectId: string; // Tensor id
};
