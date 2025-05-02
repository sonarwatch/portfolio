import {
  BeetStruct,
  FixableBeetStruct,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u128, u64 } from '../../../utils/solana';

// {
//   "name": "BaseFeeStruct",
//   "serialization": "bytemuck",
//   "repr": { "kind": "c" },
//   "type": {
//     "kind": "struct",
//     "fields": [
//       { "name": "cliff_fee_numerator", "type": "u64" },
//       { "name": "fee_scheduler_mode", "type": "u8" },
//       { "name": "padding_0", "type": { "array": ["u8", 5] } },
//       { "name": "number_of_period", "type": "u16" },
//       { "name": "period_frequency", "type": "u64" },
//       { "name": "reduction_factor", "type": "u64" },
//       { "name": "padding_1", "type": "u64" }
//     ]
//   }
// },

export type BaseFee = {
  cliffFeeNumerator: BigNumber;
  feeSchedulerMode: number;
  padding0: number[];
  numberOfPeriod: number;
  periodFrequency: BigNumber;
  reductionFactor: BigNumber;
  padding1: BigNumber;
};
export const baseFeeStruct = new BeetStruct<BaseFee>(
  [
    ['cliffFeeNumerator', u64],
    ['feeSchedulerMode', u8],
    ['padding0', uniformFixedSizeArray(u8, 5)],
    ['numberOfPeriod', u16],
    ['periodFrequency', u64],
    ['reductionFactor', u64],
    ['padding1', u64],
  ],
  (args) => args as BaseFee
);
export type DynamicFee = {
  initialized: number;
  padding: number[];
  maxVolatilityAccumulator: number;
  variableFeeControl: number;
  binStep: number;
  filterPeriod: number;
  decayPeriod: number;
  reductionFactor: number;
  lastUpdateTimestamp: BigNumber;
  binStepU128: BigNumber;
  sqrtPriceReference: BigNumber;
  volatilityAccumulator: BigNumber;
  volatilityReference: BigNumber;
};
export const dynamicFeeStruct = new BeetStruct<DynamicFee>(
  [
    ['initialized', u8],
    ['padding', uniformFixedSizeArray(u8, 7)],
    ['maxVolatilityAccumulator', u32],
    ['variableFeeControl', u32],
    ['binStep', u16],
    ['filterPeriod', u16],
    ['decayPeriod', u16],
    ['reductionFactor', u16],
    ['lastUpdateTimestamp', u64],
    ['binStepU128', u128],
    ['sqrtPriceReference', u128],
    ['volatilityAccumulator', u128],
    ['volatilityReference', u128],
  ],
  (args) => args as DynamicFee
);

export type PoolFees = {
  baseFee: BaseFee;
  protocolFeePercent: number;
  partnerFeePercent: number;
  referralFeePercent: number;
  padding0: number[];
  dynamicFee: DynamicFee;
  padding1: BigNumber;
  padding2: BigNumber;
};
export const poolFeesStruct = new BeetStruct<PoolFees>(
  [
    ['baseFee', baseFeeStruct],
    ['protocolFeePercent', u8],
    ['partnerFeePercent', u8],
    ['referralFeePercent', u8],
    ['padding0', uniformFixedSizeArray(u8, 5)],
    ['dynamicFee', dynamicFeeStruct],
    ['padding1', u64],
    ['padding2', u64],
  ],
  (args) => args as PoolFees
);

// Type for PoolMetrics
export type PoolMetrics = {
  totalLpAFee: BigNumber;
  totalLpBFee: BigNumber;
  totalProtocolAFee: BigNumber;
  totalProtocolBFee: BigNumber;
  totalPartnerAFee: BigNumber;
  totalPartnerBFee: BigNumber;
  totalPosition: BigNumber;
  padding: BigNumber;
};

// Struct for PoolMetrics
export const poolMetricsStruct = new BeetStruct<PoolMetrics>(
  [
    ['totalLpAFee', u128],
    ['totalLpBFee', u128],
    ['totalProtocolAFee', u64],
    ['totalProtocolBFee', u64],
    ['totalPartnerAFee', u64],
    ['totalPartnerBFee', u64],
    ['totalPosition', u64],
    ['padding', u64],
  ],
  (args) => args as PoolMetrics
);

export type RewardInfo = {
  initialized: number;
  rewardTokenFlag: number;
  padding0: number[];
  padding1: number[];
  mint: PublicKey;
  vault: PublicKey;
  funder: PublicKey;
  rewardDuration: BigNumber;
  rewardDurationEnd: BigNumber;
  rewardRate: BigNumber;
  rewardPerTokenStored: number[];
  lastUpdateTime: BigNumber;
  cumulativeSecondsWithEmptyLiquidityReward: BigNumber;
};

export const rewardInfoStruct = new BeetStruct<RewardInfo>(
  [
    ['initialized', u8],
    ['rewardTokenFlag', u8],
    ['padding0', uniformFixedSizeArray(u8, 6)],
    ['padding1', uniformFixedSizeArray(u8, 8)],
    ['mint', publicKey],
    ['vault', publicKey],
    ['funder', publicKey],
    ['rewardDuration', u64],
    ['rewardDurationEnd', u64],
    ['rewardRate', u128],
    ['rewardPerTokenStored', uniformFixedSizeArray(u8, 32)],
    ['lastUpdateTime', u64],
    ['cumulativeSecondsWithEmptyLiquidityReward', u64],
  ],
  (args) => args as RewardInfo
);

// Type for Pool
export type Pool = {
  discriminator: number[];
  poolFees: PoolFees;
  tokenAMint: PublicKey;
  tokenBMint: PublicKey;
  tokenAVault: PublicKey;
  tokenBVault: PublicKey;
  whitelistedVault: PublicKey;
  partner: PublicKey;
  liquidity: BigNumber;
  tokenAReserve: BigNumber;
  tokenBReserve: BigNumber;
  protocolAFee: BigNumber;
  protocolBFee: BigNumber;
  partnerAFee: BigNumber;
  partnerBFee: BigNumber;
  sqrtMinPrice: BigNumber;
  sqrtMaxPrice: BigNumber;
  sqrtPrice: BigNumber;
  activationPoint: BigNumber;
  activationType: number;
  poolStatus: number;
  tokenAFlag: number;
  tokenBFlag: number;
  collectFeeMode: number;
  poolType: number;
  padding0: number[];
  feeAPerLiquidity: number[];
  feeBPerLiquidity: number[];
  permanentLockLiquidity: BigNumber;
  metrics: PoolMetrics;
  padding1: BigNumber[];
  rewardInfos: RewardInfo[];
};

// Struct for Pool
export const poolStruct = new FixableBeetStruct<Pool>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['poolFees', poolFeesStruct],
    ['tokenAMint', publicKey],
    ['tokenBMint', publicKey],
    ['tokenAVault', publicKey],
    ['tokenBVault', publicKey],
    ['whitelistedVault', publicKey],
    ['partner', publicKey],
    ['liquidity', u128],
    ['tokenAReserve', u64],
    ['tokenBReserve', u64],
    ['protocolAFee', u64],
    ['protocolBFee', u64],
    ['partnerAFee', u64],
    ['partnerBFee', u64],
    ['sqrtMinPrice', u128],
    ['sqrtMaxPrice', u128],
    ['sqrtPrice', u128],
    ['activationPoint', u64],
    ['activationType', u8],
    ['poolStatus', u8],
    ['tokenAFlag', u8],
    ['tokenBFlag', u8],
    ['collectFeeMode', u8],
    ['poolType', u8],
    ['padding0', uniformFixedSizeArray(u8, 2)],
    ['feeAPerLiquidity', uniformFixedSizeArray(u8, 32)],
    ['feeBPerLiquidity', uniformFixedSizeArray(u8, 32)],
    ['permanentLockLiquidity', u128],
    ['metrics', poolMetricsStruct],
    ['padding1', uniformFixedSizeArray(u64, 10)],
    ['rewardInfos', uniformFixedSizeArray(rewardInfoStruct, 2)],
  ],
  (args) => args as Pool
);

// Type for PositionMetrics
export type PositionMetrics = {
  totalClaimedAFee: BigNumber;
  totalClaimedBFee: BigNumber;
};

// Struct for PositionMetrics
export const positionMetricsStruct = new BeetStruct<PositionMetrics>(
  [
    ['totalClaimedAFee', u64],
    ['totalClaimedBFee', u64],
  ],
  (args) => args as PositionMetrics
);

export type UserRewardInfo = {
  rewardPerTokenCheckpoint: number[];
  rewardPendings: BigNumber;
  totalClaimedRewards: BigNumber;
};
export const userRewardInfoStruct = new BeetStruct<UserRewardInfo>(
  [
    ['rewardPerTokenCheckpoint', uniformFixedSizeArray(u8, 32)],
    ['rewardPendings', u64],
    ['totalClaimedRewards', u64],
  ],
  (args) => args as UserRewardInfo
);

// Type for Position
export type Position = {
  discriminator: number[];
  pool: PublicKey;
  nftMint: PublicKey;
  feeAPerTokenCheckpoint: number[];
  feeBPerTokenCheckpoint: number[];
  feeAPending: BigNumber;
  feeBPending: BigNumber;
  unlockedLiquidity: BigNumber;
  vestedLiquidity: BigNumber;
  permanentLockedLiquidity: BigNumber;
  metrics: PositionMetrics;
  rewardInfos: UserRewardInfo[];
  padding: BigNumber[];
};

// Struct for Position
export const positionStruct = new FixableBeetStruct<Position>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['pool', publicKey],
    ['nftMint', publicKey],
    ['feeAPerTokenCheckpoint', uniformFixedSizeArray(u8, 32)],
    ['feeBPerTokenCheckpoint', uniformFixedSizeArray(u8, 32)],
    ['feeAPending', u64],
    ['feeBPending', u64],
    ['unlockedLiquidity', u128],
    ['vestedLiquidity', u128],
    ['permanentLockedLiquidity', u128],
    ['metrics', positionMetricsStruct],
    ['rewardInfos', uniformFixedSizeArray(userRewardInfoStruct, 2)],
    ['padding', uniformFixedSizeArray(u128, 6)],
  ],
  (args) => args as Position
);
