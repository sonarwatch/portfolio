import {
  BeetStruct,
  bool,
  i32,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { blob, i128, u128, u64 } from '../../../utils/solana';

export type PositionRewardInfo = {
  growthInsideCheckpoint: BigNumber;
  amountOwed: BigNumber;
};

export const positionRewardInfoStruct = new BeetStruct<PositionRewardInfo>(
  [
    ['growthInsideCheckpoint', u128],
    ['amountOwed', u64],
  ],
  (args) => args as PositionRewardInfo
);

export type Position = {
  padding: Buffer;
  whirlpool: PublicKey;
  positionMint: PublicKey;
  liquidity: BigNumber;
  tickLowerIndex: number;
  tickUpperIndex: number;
  feeGrowthCheckpointA: BigNumber;
  feeOwedA: BigNumber;
  feeGrowthCheckpointB: BigNumber;
  feeOwedB: BigNumber;
  rewardInfos: PositionRewardInfo[];
};

export const positionStruct = new BeetStruct<Position>(
  [
    ['padding', blob(8)],
    ['whirlpool', publicKey],
    ['positionMint', publicKey],
    ['liquidity', u128],
    ['tickLowerIndex', i32],
    ['tickUpperIndex', i32],
    ['feeGrowthCheckpointA', u128],
    ['feeOwedA', u64],
    ['feeGrowthCheckpointB', u128],
    ['feeOwedB', u64],
    ['rewardInfos', uniformFixedSizeArray(positionRewardInfoStruct, 3)],
  ],
  (args) => args as Position
);

export type WhirlpoolRewardInfo = {
  mint: PublicKey;
  vault: PublicKey;
  authority: PublicKey;
  emissionsPerSecondX64: BigNumber;
  growthGlobalX64: BigNumber;
};

export const whirlpoolRewardInfoStruct = new BeetStruct<WhirlpoolRewardInfo>(
  [
    ['mint', publicKey],
    ['vault', publicKey],
    ['authority', publicKey],
    ['emissionsPerSecondX64', u128],
    ['growthGlobalX64', u128],
  ],
  (args) => args as WhirlpoolRewardInfo
);

export type Whirlpool = {
  padding: Buffer;
  whirlpoolsConfig: PublicKey;
  whirlpoolBump: number[];
  tickSpacing: number;
  tickSpacingSeed: number[];
  feeRate: number;
  protocolFeeRate: number;
  liquidity: BigNumber;
  sqrtPrice: BigNumber;
  tickCurrentIndex: number;
  protocolFeeOwedA: BigNumber;
  protocolFeeOwedB: BigNumber;
  tokenMintA: PublicKey;
  tokenVaultA: PublicKey;
  feeGrowthGlobalA: BigNumber;
  tokenMintB: PublicKey;
  tokenVaultB: PublicKey;
  feeGrowthGlobalB: BigNumber;
  rewardLastUpdatedTimestamp: BigNumber;
  rewardInfos: WhirlpoolRewardInfo[];
};

export const whirlpoolStruct = new BeetStruct<Whirlpool>(
  [
    ['padding', blob(8)],
    ['whirlpoolsConfig', publicKey],
    ['whirlpoolBump', uniformFixedSizeArray(u8, 1)],
    ['tickSpacing', u16],
    ['tickSpacingSeed', uniformFixedSizeArray(u8, 2)],
    ['feeRate', u16],
    ['protocolFeeRate', u16],
    ['liquidity', u128],
    ['sqrtPrice', u128],
    ['tickCurrentIndex', i32],
    ['protocolFeeOwedA', u64],
    ['protocolFeeOwedB', u64],
    ['tokenMintA', publicKey],
    ['tokenVaultA', publicKey],
    ['feeGrowthGlobalA', u128],
    ['tokenMintB', publicKey],
    ['tokenVaultB', publicKey],
    ['feeGrowthGlobalB', u128],
    ['rewardLastUpdatedTimestamp', u64],
    ['rewardInfos', uniformFixedSizeArray(whirlpoolRewardInfoStruct, 3)],
  ],
  (args) => args as Whirlpool
);

export type Tick = {
  initialized: boolean;
  liquidityNet: BigNumber;
  liquidityGross: BigNumber;
  feeGrowthOutsideA: BigNumber;
  feeGrowthOutsideB: BigNumber;
  rewardGrowthsOutside1: BigNumber;
  rewardGrowthsOutside2: BigNumber;
  rewardGrowthsOutside3: BigNumber;
};

export const tickStruct = new BeetStruct<Tick>(
  [
    ['initialized', bool],
    ['liquidityNet', i128],
    ['liquidityGross', u128],
    ['feeGrowthOutsideA', u128],
    ['feeGrowthOutsideB', u128],
    ['rewardGrowthsOutside1', u128],
    ['rewardGrowthsOutside2', u128],
    ['rewardGrowthsOutside3', u128],
  ],
  (args) => args as Tick
);

export type TickArray = {
  padding: Buffer;
  startTickIndex: number;
  ticks: Tick[];
  whirlpool: PublicKey;
};

export const tickArrayStruct = new BeetStruct<TickArray>(
  [
    ['padding', blob(8)],
    ['startTickIndex', i32],
    ['ticks', uniformFixedSizeArray(tickStruct, 88)],
    ['whirlpool', publicKey],
  ],
  (args) => args as TickArray
);
