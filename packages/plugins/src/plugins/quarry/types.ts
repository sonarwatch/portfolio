import { PublicKey } from '@solana/web3.js';

export type TokenInfo = {
  decimals: number;
  mint: string;
};

export type DetailedTokenInfo = TokenInfo & {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  logoURI: string;
};

export type Quarry = {
  index: number;
  isReplica: boolean;
  mergePool: string;
  primaryToken: TokenInfo;
  primaryTokenInfo: DetailedTokenInfo;
  quarry: string;
  replicaMint: string;
  slug: string;
  stakedToken: TokenInfo;
};

export type RewardersApiRes = {
  [rewarder: string]: Omit<Rewarder, 'rewarder'>;
};

export type RewarderInfo = {
  address: string;
  id: string;
  name: string;
};

export type Rewarder = {
  rewarder: string;
  authority: string;
  info?: RewarderInfo;
  mintWrapper: string;
  quarries: Quarry[];
  rewardsToken: TokenInfo;
  rewardsTokenInfo: DetailedTokenInfo;
  slug: string;
};

export type QuarryAndMint = {
  key: PublicKey;
  rewardsMint: PublicKey;
};

export type Miner = {
  quarry: string;
  authority: string;
  bump: string;
  tokenVaultKey: string;
  rewardsEarned: string;
  rewardsPerTokenPaid: string;
  balance: string;
  index: string;
};
