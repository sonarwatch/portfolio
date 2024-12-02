import { ID } from '../../utils/sui/types/id';

export type Receipt = {
  id: ID;
  amountDeposited: string;
};

export type Pool = {
  publickey: string;
  buffer: Buffer;
  authority: string;
  poolMint: string;
  poolTokenAccount: string;
  rewardMint: string;
  rewardTokenAccount: string;
  rewardPerSecond: string;
  startTime: string;
  lastRewardTime: string;
  accPerShare: string;
  supply: string;
  bump: number;
};
