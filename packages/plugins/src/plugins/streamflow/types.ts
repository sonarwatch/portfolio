import BigNumber from 'bignumber.js';

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

export type AirdropsResponse = {
  chain: string;
  distributorAddress: string;
  address: string;
  amountUnlocked: string;
  amountLocked: string;
  amountClaimed: string;
  proof: number[];
};

export type MerkleInfo = {
  address: string;
  mint: string;
  unlockPeriod?: BigNumber;
};

export type StakePoolInfo = MerkleInfo & { stakeMint: string };
