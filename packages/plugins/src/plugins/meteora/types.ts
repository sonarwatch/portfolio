import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { DlmmVault, LbPair } from './dlmm/structs';

export type FormattedFarm = {
  pubkey: string;
  authority: string;
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
  rewardARateU128: string;
  rewardBRateU128: string;
  totalStaked: string;
  paused: boolean;
};

export type DlmmVaultC = Omit<DlmmVault, 'buffer' | 'padding' | 'padding0'> & {
  pubkey: string;
};
export type CachedDlmmVaults = Record<string, DlmmVaultC>;

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
  feeX: BigNumber;
  feeY: BigNumber;
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

export type SwapFee = {
  feeX: BigNumber;
  feeY: BigNumber;
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
