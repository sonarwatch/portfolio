type WithdrawRequest = {
  shares: string;
  value: string;
  ts: string;
};

type Vault = {
  buffer: Buffer;
  name: number[];
  pubkey: string;
  manager: string;
  tokenAccount: string;
  userStats: string;
  user: string;
  delegate: string;
  liquidationDelegate: string;
  userShares: string;
  totalShares: string;
  lastFeeUpdateTs: string;
  liquidationStartTs: string;
  redeemPeriod: string;
  totalWithdrawRequested: string;
  maxTokens: string;
  managementFee: string;
  initTs: string;
  netDeposits: string;
  managerNetDeposits: string;
  totalDeposits: string;
  totalWithdraws: string;
  managerTotalDeposits: string;
  managerTotalWithdraws: string;
  managerTotalFee: string;
  managerTotalProfitShare: string;
  minDepositAmount: string;
  lastManagerWithdrawRequest: WithdrawRequest;
  sharesBase: number;
  profitShare: number;
  hurdleRate: number;
  spotMarketIndex: number;
  bump: number;
  permissioned: boolean;
  padding: string[];
};

export type VaultEnhanced = Vault & {
  publicKey: string;
};
