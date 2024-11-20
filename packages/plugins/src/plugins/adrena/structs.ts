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
import { blob, i64, u64 } from '../../utils/solana';

export type PricingParams = {
  maxInitialLeverage: number;
  maxLeverage: number;
  maxPositionLockedUsd: BigNumber;
  maxCumulativeShortPositionSizeUsd: BigNumber;
};

export const pricingParamsStruct = new BeetStruct<PricingParams>(
  [
    ['maxInitialLeverage', u32],
    ['maxLeverage', u32],
    ['maxPositionLockedUsd', u64],
    ['maxCumulativeShortPositionSizeUsd', u64],
  ],
  (args) => args as PricingParams
);

export type Fees = {
  swapIn: number;
  swapOut: number;
  stableSwapIn: number;
  stableSwapOut: number;
  addLiquidity: number;
  removeLiquidity: number;
  closePosition: number;
  liquidation: number;
  feeMax: number;
  padding: number[];
  padding2: BigNumber;
};

export const feesStruct = new BeetStruct<Fees>(
  [
    ['swapIn', u16],
    ['swapOut', u16],
    ['stableSwapIn', u16],
    ['stableSwapOut', u16],
    ['addLiquidity', u16],
    ['removeLiquidity', u16],
    ['closePosition', u16],
    ['liquidation', u16],
    ['feeMax', u16],
    ['padding', uniformFixedSizeArray(u8, 6)],
    ['padding2', u64],
  ],
  (args) => args as Fees
);

export type BorrowRateParams = {
  maxHourlyBorrowInterestRate: BigNumber;
};

export const borrowRateParamsStruct = new BeetStruct<BorrowRateParams>(
  [['maxHourlyBorrowInterestRate', u64]],
  (args) => args as BorrowRateParams
);

export type FeesStats = {
  swapUsd: BigNumber;
  addLiquidityUsd: BigNumber;
  removeLiquidityUsd: BigNumber;
  closePositionUsd: BigNumber;
  liquidationUsd: BigNumber;
  borrowUsd: BigNumber;
};

export const feesStatsStruct = new BeetStruct<FeesStats>(
  [
    ['swapUsd', u64],
    ['addLiquidityUsd', u64],
    ['removeLiquidityUsd', u64],
    ['closePositionUsd', u64],
    ['liquidationUsd', u64],
    ['borrowUsd', u64],
  ],
  (args) => args as FeesStats
);

export type Assets = {
  collateral: BigNumber;
  owned: BigNumber;
  locked: BigNumber;
};

export const assetsStruct = new BeetStruct<Assets>(
  [
    ['collateral', u64],
    ['owned', u64],
    ['locked', u64],
  ],
  (args) => args as Assets
);

export type VolumeStats = {
  swapUsd: BigNumber;
  addLiquidityUsd: BigNumber;
  removeLiquidityUsd: BigNumber;
  openPositionUsd: BigNumber;
  closePositionUsd: BigNumber;
  liquidationUsd: BigNumber;
};

export const volumeStatsStruct = new BeetStruct<VolumeStats>(
  [
    ['swapUsd', u64],
    ['addLiquidityUsd', u64],
    ['removeLiquidityUsd', u64],
    ['openPositionUsd', u64],
    ['closePositionUsd', u64],
    ['liquidationUsd', u64],
  ],
  (args) => args as VolumeStats
);

export type TradeStats = {
  profitUsd: BigNumber;
  lossUsd: BigNumber;
  oiLongUsd: BigNumber;
  oiShortUsd: BigNumber;
};

export const tradeStatsStruct = new BeetStruct<TradeStats>(
  [
    ['profitUsd', u64],
    ['lossUsd', u64],
    ['oiLongUsd', u64],
    ['oiShortUsd', u64],
  ],
  (args) => args as TradeStats
);

export type U128Split = {
  high: BigNumber;
  low: BigNumber;
};

export const u128SplitStruct = new BeetStruct<U128Split>(
  [
    ['high', u64],
    ['low', u64],
  ],
  (args) => args as U128Split
);

export type StableLockedAmountStat = {
  custody: PublicKey;
  lockedAmount: BigNumber;
  padding: number[];
};

export const StableLockedAmountStatStruct =
  new BeetStruct<StableLockedAmountStat>(
    [
      ['custody', publicKey],
      ['lockedAmount', u64],
      ['padding', uniformFixedSizeArray(u8, 8)],
    ],
    (args) => args as StableLockedAmountStat
  );

export type PositionsAccounting = {
  openPositions: BigNumber;
  sizeUsd: BigNumber;
  borrowSizeUsd: BigNumber;
  lockedAmount: BigNumber;
  weightedPrice: U128Split;
  totalQuantity: U128Split;
  cumulativeInterestUsd: BigNumber;
  padding: number[];
  cumulativeInterestSnapshot: U128Split;
  exitFeeUsd: BigNumber;
  stableLockedAmount: StableLockedAmountStat[];
};

export const positionsAccountingStruct =
  new FixableBeetStruct<PositionsAccounting>(
    [
      ['openPositions', u64],
      ['sizeUsd', u64],
      ['borrowSizeUsd', u64],
      ['lockedAmount', u64],
      ['weightedPrice', u128SplitStruct],
      ['totalQuantity', u128SplitStruct],
      ['cumulativeInterestUsd', u64],
      ['padding', uniformFixedSizeArray(u8, 8)],
      ['cumulativeInterestSnapshot', u128SplitStruct],
      ['exitFeeUsd', u64],
      [
        'stableLockedAmount',
        uniformFixedSizeArray(StableLockedAmountStatStruct, 2),
      ],
    ],
    (args) => args as PositionsAccounting
  );

export type BorrowRateState = {
  currentRate: BigNumber;
  lastUpdate: BigNumber;
  cumulativeInterest: U128Split;
};

export const borrowRateStateStruct = new BeetStruct<BorrowRateState>(
  [
    ['currentRate', u64],
    ['lastUpdate', i64],
    ['cumulativeInterest', u128SplitStruct],
  ],
  (args) => args as BorrowRateState
);

export type Custody = {
  buffer: Buffer;
  bump: number;
  tokenAccountBump: number;
  allowTrade: number;
  allowSwap: number;
  decimals: number;
  isStable: number;
  padding: number[];
  pool: PublicKey;
  mint: PublicKey;
  tokenAccount: PublicKey;
  oracle: PublicKey;
  tradeOracle: PublicKey;
  pricing: PricingParams;
  fees: Fees;
  borrowRate: BorrowRateParams;
  collectedFees: FeesStats;
  volumeStats: VolumeStats;
  tradeStats: TradeStats;
  assets: Assets;
  longPositions: PositionsAccounting;
  shortPositions: PositionsAccounting;
  borrowRateState: BorrowRateState;
};

export const custodyStruct = new FixableBeetStruct<Custody>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['tokenAccountBump', u8],
    ['allowTrade', u8],
    ['allowSwap', u8],
    ['decimals', u8],
    ['isStable', u8],
    ['padding', uniformFixedSizeArray(u8, 2)],
    ['pool', publicKey],
    ['mint', publicKey],
    ['tokenAccount', publicKey],
    ['oracle', publicKey],
    ['tradeOracle', publicKey],
    ['pricing', pricingParamsStruct],
    ['fees', feesStruct],
    ['borrowRate', borrowRateParamsStruct],
    ['collectedFees', feesStatsStruct],
    ['volumeStats', volumeStatsStruct],
    ['tradeStats', tradeStatsStruct],
    ['assets', assetsStruct],
    ['longPositions', positionsAccountingStruct],
    ['shortPositions', positionsAccountingStruct],
    ['borrowRateState', borrowRateStateStruct],
  ],
  (args) => args as Custody
);

export type Position = {
  buffer: Buffer;
  bump: number;
  side: number;
  takeProfitThreadIsSet: number;
  stopLossThreadIsSet: number;
  padding: number[];
  owner: PublicKey;
  pool: PublicKey;
  custody: PublicKey;
  collateralCustody: PublicKey;
  openTime: BigNumber;
  updateTime: BigNumber;
  price: BigNumber;
  sizeUsd: BigNumber;
  borrowSizeUsd: BigNumber;
  collateralUsd: BigNumber;
  unrealizedLossUsd: BigNumber;
  cumulativeInterestSnapshot: U128Split;
  lockedAmount: BigNumber;
  collateralAmount: BigNumber;
  exitFeeUsd: BigNumber;
  liquidationFeeUsd: BigNumber;
  takeProfitThreadId: BigNumber;
  takeProfitLimitPrice: BigNumber;
  stopLossThreadId: BigNumber;
  stopLossLimitPrice: BigNumber;
  stopLossClosePositionPrice: BigNumber;
};

export const positionStruct = new BeetStruct<Position>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['side', u8],
    ['takeProfitThreadIsSet', u8],
    ['stopLossThreadIsSet', u8],
    ['padding', uniformFixedSizeArray(u8, 4)],
    ['owner', publicKey],
    ['pool', publicKey],
    ['custody', publicKey],
    ['collateralCustody', publicKey],
    ['openTime', i64],
    ['updateTime', i64],
    ['price', u64],
    ['sizeUsd', u64],
    ['borrowSizeUsd', u64],
    ['collateralUsd', u64],
    ['unrealizedLossUsd', u64],
    ['cumulativeInterestSnapshot', u128SplitStruct],
    ['lockedAmount', u64],
    ['collateralAmount', u64],
    ['exitFeeUsd', u64],
    ['liquidationFeeUsd', u64],
    ['takeProfitThreadId', u64],
    ['takeProfitLimitPrice', u64],
    ['stopLossThreadId', u64],
    ['stopLossLimitPrice', u64],
    ['stopLossClosePositionPrice', u64],
  ],
  (args) => args as Position
);

export type LockedStake = {
  amount: BigNumber;
  stakeTime: BigNumber;
  claimTime: BigNumber;
  endTime: BigNumber;
  lockDuration: BigNumber;
  rewardMultiplier: number;
  lmRewardMultiplier: number;
  voteMultiplier: number;
  padding: number[];
  amountWithRewardMultiplier: BigNumber;
  amountWithLmRewardMultiplier: BigNumber;
  resolved: number;
  padding2: number[];
  stakeResolutionThreadId: BigNumber;
  earlyExit: number;
  padding3: number[];
  earlyExitFee: BigNumber;
  isGenesis: number;
  padding4: number[];
  genesisClaimTime: BigNumber;
};

export const lockedStakeStruct = new BeetStruct<LockedStake>(
  [
    ['amount', u64],
    ['stakeTime', i64],
    ['claimTime', i64],
    ['endTime', i64],
    ['lockDuration', u64],
    ['rewardMultiplier', u32],
    ['lmRewardMultiplier', u32],
    ['voteMultiplier', u32],
    ['padding', uniformFixedSizeArray(u8, 4)],
    ['amountWithRewardMultiplier', u64],
    ['amountWithLmRewardMultiplier', u64],
    ['resolved', u8],
    ['padding2', uniformFixedSizeArray(u8, 7)],
    ['stakeResolutionThreadId', u64],
    ['earlyExit', u8],
    ['padding3', uniformFixedSizeArray(u8, 7)],
    ['earlyExitFee', u64],
    ['isGenesis', u8],
    ['padding4', uniformFixedSizeArray(u8, 7)],
    ['genesisClaimTime', i64],
  ],
  (args) => args as LockedStake
);

export type LiquidStake = {
  amount: BigNumber;
  stakeTime: BigNumber;
  claimTime: BigNumber;
  overlapTime: BigNumber;
  overlapAmount: BigNumber;
};

export const liquidStakeStruct = new BeetStruct<LiquidStake>(
  [
    ['amount', u64],
    ['stakeTime', i64],
    ['claimTime', i64],
    ['overlapTime', i64],
    ['overlapAmount', u64],
  ],
  (args) => args as LiquidStake
);

export type Pool = {
  buffer: number;
  padding: Buffer;
  bump: number;
  lpTokenBump: number;
  nbStableCustody: number;
  initialized: number;
  allowTrade: number;
  allowSwap: number;
  liquidityState: number;
  registeredCustodyCount: number;
  name: Buffer;
  custodies: PublicKey[];
  padding1: number[];
  whitelistedSwapper: PublicKey;
  ratios: Buffer;
  padding2: number[];
  aumUsdHigh: BigNumber;
  aumUsdLow: BigNumber;
};

export const poolStruct = new FixableBeetStruct<Pool>(
  [
    // ['padding', blob(8 + 8 + 32 + 32 * 8 + 32 + 32 + 32 + 8 * 8 + 16 + 8)],
    ['buffer', blob(8)],
    ['bump', u8],
    ['lpTokenBump', u8],
    ['nbStableCustody', u8],
    ['initialized', u8],
    ['allowTrade', u8],
    ['allowSwap', u8],
    ['liquidityState', u8],
    ['registeredCustodyCount', u8],
    ['name', blob(32)],
    ['custodies', uniformFixedSizeArray(publicKey, 8)],
    ['padding1', uniformFixedSizeArray(u8, 32)],
    ['whitelistedSwapper', publicKey],
    ['ratios', blob(64)],
    ['padding2', uniformFixedSizeArray(u8, 16)],
    ['aumUsdHigh', u64],
    ['aumUsdLow', u64],
  ],
  (args) => args as Pool
);

export type UserStaking = {
  bump: number;
  threadAuthorityBump: number;
  padding: number[];
  stakesClaimCronThreadId: BigNumber;
  liquidStake: LiquidStake;
  lockedStakes: LockedStake[];
};

export const userStakingStruct = new FixableBeetStruct<UserStaking>(
  [
    ['bump', u8],
    ['threadAuthorityBump', u8],
    ['padding', uniformFixedSizeArray(u8, 6)],
    ['stakesClaimCronThreadId', u64],
    ['liquidStake', liquidStakeStruct],
    ['lockedStakes', uniformFixedSizeArray(lockedStakeStruct, 32)],
  ],
  (args) => args as UserStaking
);
