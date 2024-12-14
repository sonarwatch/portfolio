export type AirdropResponse = {
  isEligible: boolean;
  data: Data;
};

export type Data = {
  chain: string;
  walletAddress: string;
  solanaAddress: null;
  cexName: null;
  cexAccountId: null;
  cexWalletAddress: null;
  allocation: string;
};
