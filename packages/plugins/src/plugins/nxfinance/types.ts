import BigNumber from 'bignumber.js';

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

export type StakingAccount = {
  owner: string;
  notes: string;
  stakedTokens: string;
  stakedNotes: string;
  withdrawingTokens: string;
  timeOfWithdrawApply: string;
  claimableReward: string;
  lastUpdateNoteTime: string;
  lastDistributedAndNoteRate: string;
};

export type StakingPoolAccount = {
  pubkey: string;
  stakeTokenMint: string;
  stakedTokens: string;
  stakedNotes: string;
  withdrawingTokens: string;
  increaseNoteRatePerSecond: string;
  maxMultipleOfNote: string;
};

export type VSolPositionAccount = {
  nxMarket: string;
  owner: string;
  positions: VSolPositionDetail[];
};

export type VSolPositionDetail = {
  collateralMint: string;
  borrowMint: string;
  leverageMint: string;
  collateralNote: string;
  collateralTokens: string;
  borrowNote: string;
  borrowTokens: string;
  leverageNote: string;
  leverageTokens: string;
  leverageMultiples: string;
  lastPointsAndLeverageNotesRate: string;
  pointReward: string;
};

export type FormattedLendingPool = {
  APR: number;
  borrowAPR: number;
  depositNoteNum: BigNumber;
  depositedTokenNum: BigNumber;
  depositNoteRate: number;
  borrowNoteNum: BigNumber;
  borrowedTokenNum: BigNumber;
  borrowNoteRate: number;
  depositInterest: number;
  borrowInterest: number;
};

export type StakePoolWithdrawal = {
  stakeAccount: string;
  solAmount: string;
};

export type SolayerUser = {
  nxMarket: string;
  lrtMint: string;
  amount: string;
  nxSolayerPoints: string;
  lastUpdateTime: string;
  withdrawals: StakePoolWithdrawal[][];
};

export type SolayerPool = {
  nxMarket: string;
  lrtMint: string;
  amount: string;
  totalNxSolayerPoints: string;
  lastUpdateTime: string;
};
