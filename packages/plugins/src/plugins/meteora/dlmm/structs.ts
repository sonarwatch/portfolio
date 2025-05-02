import {
  BeetStruct,
  i32,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  blob,
  i64,
  publicKeyStr,
  u128,
  u64,
  u64Str,
} from '../../../utils/solana';

export type UserRewardInfo = {
  rewardPerTokenCompletesX: BigNumber;
  rewardPerTokenCompletesY: BigNumber;
  rewardPendingsX: BigNumber;
  rewardPendingsY: BigNumber;
};

export const userRewardInfoStruct = new BeetStruct<UserRewardInfo>(
  [
    ['rewardPerTokenCompletesX', u128],
    ['rewardPerTokenCompletesY', u128],
    ['rewardPendingsX', u64],
    ['rewardPendingsY', u64],
  ],
  (args) => args as UserRewardInfo
);

export type FeeInfo = {
  feeXPerTokenComplete: BigNumber;
  feeYPerTokenComplete: BigNumber;
  feeXPending: BigNumber;
  feeYPending: BigNumber;
};

export const feeInfoStruct = new BeetStruct<FeeInfo>(
  [
    ['feeXPerTokenComplete', u128],
    ['feeYPerTokenComplete', u128],
    ['feeXPending', u64],
    ['feeYPending', u64],
  ],
  (args) => args as FeeInfo
);

export type DLMMPosition = {
  buffer: Buffer;
  lbPair: PublicKey;
  owner: PublicKey;
  liquidityShares: BigNumber[];
  rewardInfos: UserRewardInfo[];
  feeInfos: FeeInfo[];
  lowerBinId: number;
  upperBinId: number;
  lastUpdatedAt: BigNumber;
  totalClaimedFeeXAmount: BigNumber;
  totalClaimedFeeYAmount: BigNumber;
  totalClaimedRewards: BigNumber[];
  operator?: PublicKey;
  lockReleasePoint?: BigNumber;
  padding0?: number;
  feeOwner?: PublicKey;
  reserved: number[];
};

export const dlmmPositionV1Struct = new BeetStruct<DLMMPosition>(
  [
    ['buffer', blob(8)],
    ['lbPair', publicKey],
    ['owner', publicKey],
    ['liquidityShares', uniformFixedSizeArray(u64, 70)],
    ['rewardInfos', uniformFixedSizeArray(userRewardInfoStruct, 70)],
    ['feeInfos', uniformFixedSizeArray(feeInfoStruct, 70)],
    ['lowerBinId', i32],
    ['upperBinId', i32],
    ['lastUpdatedAt', i64],
    ['totalClaimedFeeXAmount', u64],
    ['totalClaimedFeeYAmount', u64],
    ['totalClaimedRewards', uniformFixedSizeArray(u64, 2)],
    ['reserved', uniformFixedSizeArray(u8, 160)],
  ],
  (args) => args as DLMMPosition
);

export const dlmmPositionV2Struct = new BeetStruct<DLMMPosition>(
  [
    ['buffer', blob(8)],
    ['lbPair', publicKey],
    ['owner', publicKey],
    ['liquidityShares', uniformFixedSizeArray(u128, 70)],
    ['rewardInfos', uniformFixedSizeArray(userRewardInfoStruct, 70)],
    ['feeInfos', uniformFixedSizeArray(feeInfoStruct, 70)],
    ['lowerBinId', i32],
    ['upperBinId', i32],
    ['lastUpdatedAt', i64],
    ['totalClaimedFeeXAmount', u64],
    ['totalClaimedFeeYAmount', u64],
    ['totalClaimedRewards', uniformFixedSizeArray(u64, 2)],
    ['operator', publicKey],
    ['lockReleasePoint', u64],
    ['padding0', u8],
    ['feeOwner', publicKey],
    ['reserved', uniformFixedSizeArray(u8, 87)],
  ],
  (args) => args as DLMMPosition
);

export type RewardInfo = {
  mint: PublicKey;
  vault: PublicKey;
  funder: PublicKey;
  rewardDuration: BigNumber;
  rewardDurationEnd: BigNumber;
  rewardRate: BigNumber;
  lastUpdateTime: BigNumber;
  cumulativeSecondsWithEmptyLiquidityReward: BigNumber;
};

export const rewardInfoStruct = new BeetStruct<RewardInfo>(
  [
    ['mint', publicKey],
    ['vault', publicKey],
    ['funder', publicKey],
    ['rewardDuration', u64],
    ['rewardDurationEnd', u64],
    ['rewardRate', u128],
    ['lastUpdateTime', u64],
    ['cumulativeSecondsWithEmptyLiquidityReward', u64],
  ],
  (args) => args as RewardInfo
);

export type ProtocolFee = {
  amountX: BigNumber;
  amountY: BigNumber;
};
export const protocolFeeStruct = new BeetStruct<ProtocolFee>(
  [
    ['amountX', u64],
    ['amountY', u64],
  ],
  (args) => args as ProtocolFee
);

export type StaticParameters = {
  baseFactor: number;
  filterPeriod: number;
  decayPeriod: number;
  reductionFactor: number;
  variableFeeControl: number;
  maxVolatilityAccumulator: number;
  minBinId: number;
  maxBinId: number;
  protocolShare: number;
  padding: number[];
};

export const staticParametersStruct = new BeetStruct<StaticParameters>(
  [
    ['baseFactor', u16],
    ['filterPeriod', u16],
    ['decayPeriod', u16],
    ['reductionFactor', u16],
    ['variableFeeControl', u32],
    ['maxVolatilityAccumulator', u32],
    ['minBinId', i32],
    ['maxBinId', i32],
    ['protocolShare', u16],
    ['padding', uniformFixedSizeArray(u8, 6)],
  ],
  (args) => args as StaticParameters
);

export type VariableParameters = {
  volatilityAccumulator: number;
  volatilityReference: number;
  indexReference: number;
  padding: number[];
  lastUpdateTimestamp: BigNumber;
  padding1: number[];
};

export const variableParametersStruct = new BeetStruct<VariableParameters>(
  [
    ['volatilityAccumulator', u32],
    ['volatilityReference', u32],
    ['indexReference', i32],
    ['padding', uniformFixedSizeArray(u8, 4)],
    ['lastUpdateTimestamp', i64],
    ['padding1', uniformFixedSizeArray(u8, 8)],
  ],
  (args) => args as VariableParameters
);

export type LbPair = {
  buffer: Buffer;
  parameters: StaticParameters;
  vParameters: VariableParameters;
  bumpSeed: number[];
  binStepSeed: number[];
  pairType: number;
  activeId: number;
  binStep: number;
  status: number;
  requireBaseFactorSeed: number;
  baseFactorSeed: number[];
  activationType: number;
  padding1: number;
  tokenXMint: PublicKey;
  tokenYMint: PublicKey;
  reserveX: PublicKey;
  reserveY: PublicKey;
  protocolFee: ProtocolFee;
  padding2: number[];
  rewardInfos: RewardInfo[];
  oracle: PublicKey;
  binArrayBitmap: BigNumber[];
  lastUpdatedAt: BigNumber;
  whitelistedWallet: number[];
  preActivationSwapAddress: PublicKey;
  baseKey: PublicKey;
  activationPoint: BigNumber;
  preActivationDuration: BigNumber;
  padding3: number[];
  padding4: BigNumber;
  creator: PublicKey;
  reserved: number[];
};

export const lbPairStruct = new BeetStruct<LbPair>(
  [
    ['buffer', blob(8)],
    ['parameters', staticParametersStruct],
    ['vParameters', variableParametersStruct],
    ['bumpSeed', uniformFixedSizeArray(u8, 1)],
    ['binStepSeed', uniformFixedSizeArray(u8, 2)],
    ['pairType', u8],
    ['activeId', i32],
    ['binStep', u16],
    ['status', u8],
    ['requireBaseFactorSeed', u8],
    ['baseFactorSeed', uniformFixedSizeArray(u8, 2)],
    ['activationType', u8],
    ['padding1', u8],
    ['tokenXMint', publicKey],
    ['tokenYMint', publicKey],
    ['reserveX', publicKey],
    ['reserveY', publicKey],
    ['protocolFee', protocolFeeStruct],
    ['padding2', uniformFixedSizeArray(u8, 32)],
    ['rewardInfos', uniformFixedSizeArray(rewardInfoStruct, 2)],
    ['oracle', publicKey],
    ['binArrayBitmap', uniformFixedSizeArray(u64, 16)],
    ['lastUpdatedAt', i64],
    ['whitelistedWallet', uniformFixedSizeArray(u8, 32)],
    ['preActivationSwapAddress', publicKey],
    ['baseKey', publicKey],
    ['activationPoint', u64],
    ['preActivationDuration', u64],
    ['padding3', uniformFixedSizeArray(u8, 8)],
    ['padding4', u64],
    ['creator', publicKey],
    ['reserved', uniformFixedSizeArray(u8, 24)],
  ],
  (args) => args as LbPair
);

export type Bin = {
  amountX: BigNumber;
  amountY: BigNumber;
  price: BigNumber;
  liquiditySupply: BigNumber;
  rewardPerTokenXStored: BigNumber;
  rewardPerTokenYStored: BigNumber;
  feeAmountXPerTokenStored: BigNumber;
  feeAmountYPerTokenStored: BigNumber;
  amountXIn: BigNumber;
  amountYIn: BigNumber;
};

export const binStruct = new BeetStruct<Bin>(
  [
    ['amountX', u64],
    ['amountY', u64],
    ['price', u128],
    ['liquiditySupply', u128],
    ['rewardPerTokenXStored', u128],
    ['rewardPerTokenYStored', u128],
    ['feeAmountXPerTokenStored', u128],
    ['feeAmountYPerTokenStored', u128],
    ['amountXIn', u128],
    ['amountYIn', u128],
  ],
  (args) => args as Bin
);

export type BinArray = {
  buffer: Buffer;
  index: BigNumber;
  version: number;
  padding: number[];
  lbPair: PublicKey;
  bins: Bin[];
};

export const binArrayStruct = new BeetStruct<BinArray>(
  [
    ['buffer', blob(8)],
    ['index', i64],
    ['version', u8],
    ['padding', uniformFixedSizeArray(u8, 7)],
    ['lbPair', publicKey],
    ['bins', uniformFixedSizeArray(binStruct, 70)],
  ],
  (args) => args as BinArray
);

export type DlmmVault = {
  buffer: Buffer;
  lbPair: string;
  tokenVault: string;
  tokenOutVault: string;
  quoteMint: string;
  baseMint: string;
  base: string;
  owner: string;
  maxCap: string;
  totalDeposit: string;
  totalEscrow: string;
  swappedAmount: string;
  boughtToken: string;
  totalRefund: string;
  totalClaimedToken: string;
  startVestingTs: string;
  endVestingTs: string;
  bump: number;
  padding0: number[];
  padding: Buffer;
};

export const dlmmVaultStruct = new BeetStruct<DlmmVault>(
  [
    ['buffer', blob(8)],
    ['lbPair', publicKeyStr],
    ['tokenVault', publicKeyStr],
    ['tokenOutVault', publicKeyStr],
    ['quoteMint', publicKeyStr],
    ['baseMint', publicKeyStr],
    ['base', publicKeyStr],
    ['owner', publicKeyStr],
    ['maxCap', u64Str],
    ['totalDeposit', u64Str],
    ['totalEscrow', u64Str],
    ['swappedAmount', u64Str],
    ['boughtToken', u64Str],
    ['totalRefund', u64Str],
    ['totalClaimedToken', u64Str],
    ['startVestingTs', u64Str],
    ['endVestingTs', u64Str],
    ['bump', u8],
    ['padding0', uniformFixedSizeArray(u8, 7)],
    ['padding', blob(160)],
  ],
  (args) => args as DlmmVault
);
