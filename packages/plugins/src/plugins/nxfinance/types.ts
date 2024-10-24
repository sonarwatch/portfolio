export type MarginAccount = {
  leveragefi: string;
  owner: string;
  deposits: CollateralDetail[];
  loans: LoanDetail[];
  leverage: string;
  jlpNotes: string;
  activeLoan: string;
};

export type CollateralDetail = {
  tokenMint: string;
  depositNote: string;
  depositToken: string;
  marketValue: string;
};

export type LoanDetail = {
  tokenMint: string;
  loanNote: string;
  loanToken: string;
  loanValue: string;
};

export type MarginPool = {
  leveragefi: string;
  vault: string;
  feeDestination: string;
  poolAuthority: string;
  tokenMint: string;
  tokenPriceOracle: string;
  borrowedTokens: string;
  depositTokens: string;
  depositNotes: string;
  loanNotes: string;
  depositInterest: string;
  loanInterest: string;
  protocolFee: string;
  accruedUntil: string;
  utilizationFlag: string;
};

export type LendingPool = {
  nxMarket: string;
  tokenMint: string;
  borrowTokens: string;
  borrowNotes: string;
  depositTokens: string;
  depositNotes: string;
  depositInterest: string;
  borrowInterest: string;
  protocolFee: string;
  accruedUntil: string;
  utilizationFlag: number;
  interestRateConfigs: {
    utilizationRate: number;
    kValue: number;
    bValue: number;
  }[];
};

export type LendingAccount = {
  nxMarket: string;
  owner: string;
  depositNotes: string;
  depositTokens: string;
  lastNoteRate: string;
  totalReward: string;
};
