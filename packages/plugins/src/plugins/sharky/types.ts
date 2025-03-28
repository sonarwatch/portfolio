export type Loan = {
  version: number;
  principalLamports: string;
  orderBook: string;
  valueTokenMint: string;
  escrowBumSeed: number;
  loanState: {
    offer?: LoanOffer;
    taken?: TakenLoan;
  };
};

export type LoanOffer = {
  offer: {
    lenderWallet: string;
    termsSpec: LoanTermsSpec;
    offerTime: number;
  };
};

export type TakenLoan = {
  taken: {
    nftCollateralMint: string;
    lenderNoteMint: string;
    borrowerNoteMint: string;
    apy: APY;
    terms: LoanTerms;
    isCollateralFrozen: number;
  };
};

export type APY = {
  fixed: {
    apy: number;
  };
};

export type LoanTerms = {
  time: {
    start: number;
    duration: string;
    totalOwedLamports: string;
  };
};

export type LoanTermsSpec = {
  time: {
    duration: string;
  };
};

export type Collection = {
  orderBook: string;
  name: string;
  floor: number;
  tensor_id: string;
};
