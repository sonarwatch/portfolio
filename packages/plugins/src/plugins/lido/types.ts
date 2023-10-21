export type WithdrawalStatus = {
  amountOfStETH: bigint;
  amountOfShares: bigint;
  owner: string;
  timestamp: bigint;
  isFinalized: boolean;
  isClaimed: boolean;
};
