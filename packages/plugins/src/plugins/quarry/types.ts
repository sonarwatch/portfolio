import { PublicKey } from '@solana/web3.js';
import { SourceRef } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

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
  replicaQuarries: {
    quarry: string;
  }[];
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

export type MergeMiner = {
  pool: string;
  owner: string;
  bump: number;
  index: string;
  primaryBalance: string;
  replicaBalance: string;
};

export type QuarryPDA = {
  primaryQuarry: PublicKey;
  mm: PublicKey;
  rewarder: PublicKey;
  replicas: {
    rewardsMint: PublicKey;
    replicaMMMiner: PublicKey;
    rewarder: PublicKey;
    replicaQuarry: PublicKey;
  }[];
  ownerMiner: PublicKey;
  mmMiner: PublicKey;
  rewardsToken: PublicKey;
};

export type Redeemer = {
  iouMint: string;
  redemptionMint: string;
};

export type Position = {
  ref: string;
  sourceRefs: SourceRef[];
  primaryRewarder: {
    slug: string;
    name?: string;
  };
  rewardsTokenInfo: DetailedTokenInfo[];
  rewardsBalance: BigNumber[];
  stakedTokenInfo: DetailedTokenInfo;
  stakedBalance: string;
};

export type QuarryData = {
  rewarder: string;
  tokenMintKey: string;
  index: number;
  tokenMintDecimals: number;
  famineTs: string;
  lastUpdateTs: string;
  rewardsPerTokenStored: string;
  annualRewardsRate: string;
  rewardsShare: string;
  totalTokensDeposited: string;
  numMiners: string;
};
