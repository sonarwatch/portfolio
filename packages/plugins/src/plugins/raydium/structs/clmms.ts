import {
  BeetStruct,
  FixableBeetStruct,
  i32,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { blob, i128, u128, u64 } from '../../../utils/solana';

export type PositionRewardInfo = {
  growthInsideLastX64: BigNumber;
  rewardAmountOwed: BigNumber;
};

export const positionRewardInfoStruct = new BeetStruct<PositionRewardInfo>(
  [
    ['growthInsideLastX64', u128],
    ['rewardAmountOwed', u64],
  ],
  (args) => args as PositionRewardInfo
);

export type PersonalPositionState = {
  buffer: Buffer;
  bump: number;
  nftMint: PublicKey;
  poolId: PublicKey;
  tickLowerIndex: number;
  tickUpperIndex: number;
  liquidity: BigNumber;
  feeGrowthInside0LastX64: BigNumber;
  feeGrowthInside1LastX64: BigNumber;
  tokenFeesOwed0: BigNumber;
  tokenFeesOwed1: BigNumber;
  rewardInfos: PositionRewardInfo[];
  padding: BigNumber[];
};

export const personalPositionStateStruct =
  new BeetStruct<PersonalPositionState>(
    [
      ['buffer', blob(8)],
      ['bump', u8],
      ['nftMint', publicKey],
      ['poolId', publicKey],
      ['tickLowerIndex', i32],
      ['tickUpperIndex', i32],
      ['liquidity', u128],
      ['feeGrowthInside0LastX64', u128],
      ['feeGrowthInside1LastX64', u128],
      ['tokenFeesOwed0', u64],
      ['tokenFeesOwed1', u64],
      ['rewardInfos', uniformFixedSizeArray(positionRewardInfoStruct, 3)],
      ['padding', uniformFixedSizeArray(u64, 8)],
    ],
    (args) => args as PersonalPositionState
  );

export type RewardInfo = {
  rewardState: number;
  openTime: BigNumber;
  endTime: BigNumber;
  lastUpdateTime: BigNumber;
  emissionsPerSecondX64: BigNumber;
  rewardTotalEmissioned: BigNumber;
  rewardClaimed: BigNumber;
  tokenMint: PublicKey;
  tokenVault: PublicKey;
  authority: PublicKey;
  rewardGrowthGlobalX64: BigNumber;
};

export const rewardInfoStruct = new BeetStruct<RewardInfo>(
  [
    ['rewardState', u8],
    ['openTime', u64],
    ['endTime', u64],
    ['lastUpdateTime', u64],
    ['emissionsPerSecondX64', u128],
    ['rewardTotalEmissioned', u64],
    ['rewardClaimed', u64],
    ['tokenMint', publicKey],
    ['tokenVault', publicKey],
    ['authority', publicKey],
    ['rewardGrowthGlobalX64', u128],
  ],
  (args) => args as RewardInfo
);

export type PoolState = {
  buffer: Buffer;
  bump: Buffer;
  ammConfig: PublicKey;
  owner: PublicKey;
  tokenMint0: PublicKey;
  tokenMint1: PublicKey;
  tokenVault0: PublicKey;
  tokenVault1: PublicKey;
  observationKey: PublicKey;
  mintDecimals0: number;
  mintDecimals1: number;
  tickSpacing: number;
  liquidity: BigNumber;
  sqrtPriceX64: BigNumber;
  tickCurrent: number;
  observationIndex: number;
  observationUpdateDuration: number;
  feeGrowthGlobal0X64: BigNumber;
  feeGrowthGlobal1X64: BigNumber;
  protocolFeesToken0: BigNumber;
  protocolFeesToken1: BigNumber;
  swapInAmountToken0: BigNumber;
  swapOutAmountToken1: BigNumber;
  swapInAmountToken1: BigNumber;
  swapOutAmountToken0: BigNumber;
  status: number;
  rewardInfos: RewardInfo[];
  padding: number[];
  tickArrayBitmap: BigNumber[];
  totalFeesToken0: BigNumber;
  totalFeesClaimedToken0: BigNumber;
  totalFeesToken1: BigNumber;
  totalFeesClaimedToken1: BigNumber;
  fundFeesToken0: BigNumber;
  fundFeesToken1: BigNumber;
  openTime: BigNumber;
  padding1: BigNumber[];
  padding2: BigNumber[];
};

export const poolStateStruct = new BeetStruct<PoolState>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['ammConfig', publicKey],
    ['owner', publicKey],
    ['tokenMint0', publicKey],
    ['tokenMint1', publicKey],
    ['tokenVault0', publicKey],
    ['tokenVault1', publicKey],
    ['observationKey', publicKey],
    ['mintDecimals0', u8],
    ['mintDecimals1', u8],
    ['tickSpacing', u16],
    ['liquidity', u128],
    ['sqrtPriceX64', u128],
    ['tickCurrent', i32],
    ['observationIndex', u16],
    ['observationUpdateDuration', u16],
    ['feeGrowthGlobal0X64', u128],
    ['feeGrowthGlobal1X64', u128],
    ['protocolFeesToken0', u64],
    ['protocolFeesToken1', u64],

    ['swapInAmountToken0', u128],
    ['swapOutAmountToken1', u128],
    ['swapInAmountToken1', u128],
    ['swapOutAmountToken0', u128],

    ['status', u8],

    ['padding', uniformFixedSizeArray(u8, 7)],
    ['rewardInfos', uniformFixedSizeArray(rewardInfoStruct, 3)],
    ['tickArrayBitmap', uniformFixedSizeArray(u64, 16)],

    ['totalFeesToken0', u64],
    ['totalFeesClaimedToken0', u64],
    ['totalFeesToken1', u64],
    ['totalFeesClaimedToken1', u64],
    ['fundFeesToken0', u64],
    ['fundFeesToken1', u64],
    ['openTime', u64],
    ['padding1', uniformFixedSizeArray(u64, 26)],
    ['padding2', uniformFixedSizeArray(u64, 32)],
  ],
  (args) => args as PoolState
);

export type TickState = {
  tick: number;
  liquidityNet: BigNumber;
  liquidityGross: BigNumber;
  feeGrowthOutsideX64A: BigNumber;
  feeGrowthOutsideX64B: BigNumber;
  rewardGrowthsOutsideX640: BigNumber;
  rewardGrowthsOutsideX641: BigNumber;
  rewardGrowthsOutsideX642: BigNumber;
  padding: number[];
};

export const tickStatetruct = new BeetStruct<TickState>(
  [
    ['tick', i32],
    ['liquidityNet', i128],
    ['liquidityGross', u128],
    ['feeGrowthOutsideX64A', u128],
    ['feeGrowthOutsideX64B', u128],
    ['rewardGrowthsOutsideX640', u128],
    ['rewardGrowthsOutsideX641', u128],
    ['rewardGrowthsOutsideX642', u128],
    ['padding', uniformFixedSizeArray(u32, 13)],
  ],
  (args) => args as TickState
);

export type TickArrayState = {
  buffer: Buffer;
  poolId: PublicKey;
  startTickIndex: number;
  ticks: TickState[];
  initializedTickCount: number;
  padding: number[];
};

export const tickArrayStatetruct = new FixableBeetStruct<TickArrayState>(
  [
    ['buffer', blob(8)],
    ['poolId', publicKey],
    ['startTickIndex', i32],
    ['ticks', uniformFixedSizeArray(tickStatetruct, 60)],
    ['initializedTickCount', u8],
    ['padding', uniformFixedSizeArray(u8, 115)],
  ],
  (args) => args as TickArrayState
);
