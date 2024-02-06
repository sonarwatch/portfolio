import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { LbPair } from './struct';

export type Farm = {
  pubkey: string;
  authority: string;
  paused: boolean;
  stakingMint: string;
  stakingVault: string;
  rewardAMint: string;
  rewardAVault: string;
  rewardBMint: string;
  rewardBVault: string;
  rewardDuration: string;
  rewardDurationEnd: string;
  lastUpdateTime: string;
  rewardARate: string;
  rewardBRate: string;
  rewardAPerTokenStored: string;
  rewardBPerTokenStored: string;
  userStakeCount: number;
  funders: string[];
  rewardARateU128: string;
  rewardBRateU128: string;
  poolBump: number;
  totalStaked: string;
};

export enum PositionVersion {
  V1,
  V2,
}

export enum StrategyType {
  Spot,
  Curve,
  BidAsk,
}

export type PositionBinData = {
  binId: number;
  price: string;
  pricePerToken: string;
  binXAmount: string;
  binYAmount: string;
  binLiquidity: string;
  positionLiquidity: string;
  positionXAmount: string;
  positionYAmount: string;
};

export type PositionData = {
  totalXAmount: BigNumber;
  totalYAmount: BigNumber;
  positionBinData: PositionBinData[];
  upperBinId: number;
  lowerBinId: number;
  rewardOne: BigNumber;
  rewardTwo: BigNumber;
};

export type LbPosition = {
  publicKey: PublicKey;
  positionData: PositionData;
  version: PositionVersion;
};

export type PositionInfo = {
  publicKey: PublicKey;
  lbPair: LbPair;
  tokenX: TokenReserve;
  tokenY: TokenReserve;
  lbPairPositionsData: Array<LbPosition>;
};

export type TokenReserve = {
  publicKey: PublicKey;
  reserve: PublicKey;
  amount: BigNumber;
  decimal: number;
};

export type LMRewards = {
  rewardOne: BigNumber;
  rewardTwo: BigNumber;
};

export interface BinLiquidity {
  binId: number;
  xAmount: BigNumber;
  yAmount: BigNumber;
  supply: BigNumber;
  version: number;
  price: string;
  pricePerToken: string;
}
