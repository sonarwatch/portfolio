import {
  BeetStruct,
  bool,
  i32,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, i64, u128, u64 } from '../../utils/solana';
import { OracleType, Side } from '../jupiter/exchange/structs';

export type OracleParams = {
  oracleAccount: PublicKey;
  customOracleAccount: PublicKey;
  oracleType: OracleType;
  maxDivergenceBps: BigNumber;
  maxConfBps: BigNumber;
  maxPriceAgeSec: BigNumber;
};

export const oracleParamsStruct = new BeetStruct<OracleParams>(
  [
    ['oracleAccount', publicKey],
    ['customOracleAccount', publicKey],
    ['oracleType', u8],
    ['maxDivergenceBps', u64],
    ['maxConfBps', u64],
    ['maxPriceAgeSec', u64],
  ],
  (args) => args as OracleParams
);

export type PricingParams = {
  tradeSpreadLong: BigNumber;
  tradeSpreadShort: BigNumber;
  swapSpread: BigNumber;
  minInitialLeverage: BigNumber;
  maxInitialLeverage: BigNumber;
  maxLeverage: BigNumber;
  minCollateralUsd: BigNumber;
  delaySeconds: BigNumber;
  maxUtilization: BigNumber;
  maxPositionLockedUsd: BigNumber;
  maxTotalLockedUsd: BigNumber;
};

export const pricingParamsStruct = new BeetStruct<PricingParams>(
  [
    ['tradeSpreadLong', u64],
    ['tradeSpreadShort', u64],
    ['swapSpread', u64],
    ['minInitialLeverage', u64],
    ['maxInitialLeverage', u64],
    ['maxLeverage', u64],
    ['minCollateralUsd', u64],
    ['delaySeconds', i64],
    ['maxUtilization', u64],
    ['maxPositionLockedUsd', u64],
    ['maxTotalLockedUsd', u64],
  ],
  (args) => args as PricingParams
);

export enum FeesMode {
  Fixed,
  Linear,
}

export type RatioFees = {
  minFee: BigNumber;
  targetFee: BigNumber;
  maxFee: BigNumber;
};

export const ratioFeesStruct = new BeetStruct<RatioFees>(
  [
    ['minFee', u64],
    ['targetFee', u64],
    ['maxFee', u64],
  ],
  (args) => args as RatioFees
);

export type Fees = {
  mode: FeesMode;
  swapIn: RatioFees;
  swapOut: RatioFees;
  stableSwapIn: RatioFees;
  stableSwapOut: RatioFees;
  addLiquidity: RatioFees;
  removeLiquidity: RatioFees;
  openPosition: BigNumber;
  closePosition: BigNumber;
  removeCollateral: BigNumber;
};

export const feesStruct = new BeetStruct<Fees>(
  [
    ['mode', u8],
    ['swapIn', ratioFeesStruct],
    ['swapOut', ratioFeesStruct],
    ['stableSwapIn', ratioFeesStruct],
    ['stableSwapOut', ratioFeesStruct],
    ['addLiquidity', ratioFeesStruct],
    ['removeLiquidity', ratioFeesStruct],
    ['openPosition', u64],
    ['closePosition', u64],
    ['removeCollateral', u64],
  ],
  (args) => args as Fees
);

export type BorrowRateParams = {
  baseRate: BigNumber;
  slope1: BigNumber;
  slope2: BigNumber;
  optimalUtilization: BigNumber;
};

export const borrowRateParamsStruct = new BeetStruct<BorrowRateParams>(
  [
    ['baseRate', u64],
    ['slope1', u64],
    ['slope2', u64],
    ['optimalUtilization', u64],
  ],
  (args) => args as BorrowRateParams
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

export type BorrowRateState = {
  currentRate: BigNumber;
  cumulativeLockFee: BigNumber;
  lastUpdate: BigNumber;
};

export const borrowRateStateStruct = new BeetStruct<BorrowRateState>(
  [
    ['currentRate', u64],
    ['cumulativeLockFee', u128],
    ['lastUpdate', i64],
  ],
  (args) => args as BorrowRateState
);

export type FeesStats = {
  accrued: BigNumber;
  distributed: BigNumber;
  paid: BigNumber;
  rewardPerLpStaked: BigNumber;
  protocolFee: BigNumber;
};

export const feesStatsStruct = new BeetStruct<FeesStats>(
  [
    ['accrued', u128],
    ['distributed', u128],
    ['paid', u128],
    ['rewardPerLpStaked', u64],
    ['protocolFee', u64],
  ],
  (args) => args as FeesStats
);

export type Permissions = {
  allowSwap: boolean;
  allowAddLiquidity: boolean;
  allowRemoveLiquidity: boolean;
  allowOpenPosition: boolean;
  allowClosePosition: boolean;
  allowCollateralWithdrawal: boolean;
  allowSizeChange: boolean;
  allowLiquidation: boolean;
  allowFlpStaking: boolean;
  allowFeeDistribution: boolean;
  allowUngatedTrading: boolean;
  allowFeeDiscounts: boolean;
  allowReferralRebates: boolean;
};

export const permissionsStruct = new BeetStruct<Permissions>(
  [
    ['allowSwap', bool],
    ['allowAddLiquidity', bool],
    ['allowRemoveLiquidity', bool],
    ['allowOpenPosition', bool],
    ['allowClosePosition', bool],
    ['allowCollateralWithdrawal', bool],
    ['allowSizeChange', bool],
    ['allowLiquidation', bool],
    ['allowFlpStaking', bool],
    ['allowFeeDistribution', bool],
    ['allowUngatedTrading', bool],
    ['allowFeeDiscounts', bool],
    ['allowReferralRebates', bool],
  ],
  (args) => args as Permissions
);

export type Custody = {
  buffer: Buffer;
  pool: PublicKey;
  mint: PublicKey;
  tokenAccount: PublicKey;
  decimals: number;
  isStable: boolean;
  depegAdjustment: boolean;
  isVirtual: boolean;
  distributeRewards: boolean;
  oracle: OracleParams;
  pricing: PricingParams;
  permissions: Permissions;
  fees: Fees;
  borrowRate: BorrowRateParams;
  rewardThreshold: BigNumber;
  assets: Assets;
  feesStats: FeesStats;
  borrowRateState: BorrowRateState;
  bump: number;
  tokenAccountBump: number;
  buffer2: Buffer;
};

export const custodyStruct = new BeetStruct<Custody>(
  [
    ['buffer', blob(8)],
    ['pool', publicKey],
    ['mint', publicKey],
    ['tokenAccount', publicKey],
    ['decimals', u8],
    ['isStable', bool],
    ['depegAdjustment', bool],
    ['isVirtual', bool],
    ['distributeRewards', bool],
    ['oracle', oracleParamsStruct],
    ['pricing', pricingParamsStruct],
    ['permissions', permissionsStruct],
    ['fees', feesStruct],
    ['borrowRate', borrowRateParamsStruct],
    ['rewardThreshold', u64],
    ['assets', assetsStruct],
    ['feesStats', feesStatsStruct],
    ['borrowRateState', borrowRateStateStruct],
    ['bump', u8],
    ['tokenAccountBump', u8],
    ['buffer2', blob(18)],
  ],
  (args) => args as Custody
);

export type StakeStats = {
  pendingActivation: BigNumber;
  activeAmount: BigNumber;
  pendingDeactivation: BigNumber;
  deactivatedAmount: BigNumber;
};

export const stakeStatsStruct = new BeetStruct<StakeStats>(
  [
    ['pendingActivation', u64],
    ['activeAmount', u64],
    ['pendingDeactivation', u64],
    ['deactivatedAmount', u64],
  ],
  (args) => args as StakeStats
);

export type FlpStake = {
  buffer: Buffer;
  owner: PublicKey;
  pool: PublicKey;
  stakeStats: StakeStats;
  rewardSnapshot: BigNumber;
  unclaimedRewards: BigNumber;
  feeShareBps: BigNumber;
  isInitialized: boolean;
  bump: number;
};

export const flpStakeStruct = new BeetStruct<FlpStake>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['pool', publicKey],
    ['stakeStats', stakeStatsStruct],
    ['rewardSnapshot', u128],
    ['unclaimedRewards', u64],
    ['feeShareBps', u64],
    ['isInitialized', bool],
    ['bump', u8],
  ],
  (args) => args as FlpStake
);

export type MarketPermissions = {
  allowOpenPosition: boolean;
  allowClosePosition: boolean;
  allowCollateralWithdrawal: boolean;
  allowSizeChange: boolean;
};

export const marketPermissionsStruct = new BeetStruct<MarketPermissions>(
  [
    ['allowOpenPosition', bool],
    ['allowClosePosition', bool],
    ['allowCollateralWithdrawal', bool],
    ['allowSizeChange', bool],
  ],
  (args) => args as MarketPermissions
);

export type OraclePrice = {
  price: BigNumber;
  exponent: number;
};

export const oraclePriceStruct = new BeetStruct<OraclePrice>(
  [
    ['price', u64],
    ['exponent', i32],
  ],
  (args) => args as OraclePrice
);

export type PositionStats = {
  openPositions: BigNumber;
  updateTime: BigNumber;
  averageEntryPrice: OraclePrice;
  sizeAmount: BigNumber;
  sizeUsd: BigNumber;
  lockedAmount: BigNumber;
  lockedUsd: BigNumber;
  collateralAmount: BigNumber;
  collateralUsd: BigNumber;
  unsettledFeeUsd: BigNumber;
  cumulativeLockFeeSnapshot: BigNumber;
  sizeDecimals: number;
  lockedDecimals: number;
  collateralDecimals: number;
};

export const positionStatsStruct = new BeetStruct<PositionStats>(
  [
    ['openPositions', u64],
    ['updateTime', i64],
    ['averageEntryPrice', oraclePriceStruct],
    ['sizeAmount', u64],
    ['sizeUsd', u64],
    ['lockedAmount', u64],
    ['lockedUsd', u64],
    ['collateralAmount', u64],
    ['collateralUsd', u64],
    ['unsettledFeeUsd', u64],
    ['cumulativeLockFeeSnapshot', u128],
    ['sizeDecimals', u8],
    ['lockedDecimals', u8],
    ['collateralDecimals', u8],
  ],
  (args) => args as PositionStats
);

export type Market = {
  buffer: Buffer;
  pool: PublicKey;
  targetCustody: PublicKey;
  collateralCustody: PublicKey;
  side: Side;
  correlation: boolean;
  maxPayoffBps: BigNumber;
  permissions: MarketPermissions;
  openInterest: BigNumber;
  collectivePosition: PositionStats;
  targetCustodyId: BigNumber;
  collateralCustodyId: BigNumber;
  bump: Buffer;
};

export const marketStruct = new BeetStruct<Market>(
  [
    ['buffer', blob(8)],
    ['pool', publicKey],
    ['targetCustody', publicKey],
    ['collateralCustody', publicKey],
    ['side', u8],
    ['correlation', bool],
    ['maxPayoffBps', u64],
    ['permissions', marketPermissionsStruct],
    ['openInterest', u64],
    ['collectivePosition', positionStatsStruct],
    ['targetCustodyId', u64],
    ['collateralCustodyId', u64],
    ['bump', blob(11)],
  ],
  (args) => args as Market
);

export type Position = {
  buffer: Buffer;
  owner: PublicKey;
  market: PublicKey;
  delegate: PublicKey;
  openTime: BigNumber;
  updateTime: BigNumber;
  entryPrice: OraclePrice;
  sizeAmount: BigNumber;
  sizeUsd: BigNumber;
  lockedAmount: BigNumber;
  lockedUsd: BigNumber;
  collateralAmount: BigNumber;
  collateralUsd: BigNumber;
  unsettledAmount: BigNumber;
  unsettledFeesUsd: BigNumber;
  cumulativeLockFeeSnapshot: BigNumber;
  takeProfitPrice: OraclePrice;
  stopLossPrice: OraclePrice;
  sizeDecimals: number;
  lockedDecimals: number;
  collateralDecimals: number;
  bump: number;
};

export const positionStruct = new BeetStruct<Position>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['market', publicKey],
    ['delegate', publicKey],
    ['openTime', i64],
    ['updateTime', i64],
    ['entryPrice', oraclePriceStruct],
    ['sizeAmount', u64],
    ['sizeUsd', u64],
    ['lockedAmount', u64],
    ['lockedUsd', u64],
    ['collateralAmount', u64],
    ['collateralUsd', u64],
    ['unsettledAmount', u64],
    ['unsettledFeesUsd', u64],
    ['cumulativeLockFeeSnapshot', u128],
    ['takeProfitPrice', oraclePriceStruct],
    ['stopLossPrice', oraclePriceStruct],
    ['sizeDecimals', u8],
    ['lockedDecimals', u8],
    ['collateralDecimals', u8],
    ['bump', u8],
  ],
  (args) => args as Position
);

export type TokenRatios = {
  target: BigNumber;
  min: BigNumber;
  max: BigNumber;
};

export const tokenRatiosStruct = new BeetStruct<TokenRatios>(
  [
    ['target', u64],
    ['min', u64],
    ['max', u64],
  ],
  (args) => args as TokenRatios
);

export type Pool = {
  buffer: Buffer;
  nameLength: number;
  name: number[];
  permissions: Permissions;
  inceptionTime: BigNumber;
  flpMint: PublicKey;
  oracleAuthority: PublicKey;
  flpTokenAccount: PublicKey;
  rewardCustody: PublicKey;
  custodiesLength: number;
  custodies: PublicKey[];
  ratiosLength: number;
  ratios: TokenRatios[];
  marketsLength: number;
  markets: PublicKey[];
  maxAumUsd: BigNumber;
  aumUsd: BigNumber;
  totalStaked: StakeStats;
  stakingFeeShareBps: BigNumber;
  bump: number;
  flpMintBump: number;
  flpTokenAccountBump: number;
  vpVolumeFactor: number;
};

export const pool1Struct = new BeetStruct<Pool>(
  [
    ['buffer', blob(8)],
    ['nameLength', u32],
    ['name', uniformFixedSizeArray(u8, 8)],
    ['permissions', permissionsStruct],
    ['inceptionTime', i64],
    ['flpMint', publicKey],
    ['oracleAuthority', publicKey],
    ['flpTokenAccount', publicKey],
    ['rewardCustody', publicKey],
    ['custodiesLength', u32],
    ['custodies', uniformFixedSizeArray(publicKey, 4)],
    ['ratiosLength', u32],
    ['ratios', uniformFixedSizeArray(tokenRatiosStruct, 4)],
    ['marketsLength', u32],
    ['markets', uniformFixedSizeArray(publicKey, 6)],
    ['maxAumUsd', u128],
    ['aumUsd', u128],
    ['totalStaked', stakeStatsStruct],
    ['stakingFeeShareBps', u64],
    ['bump', u8],
    ['flpMintBump', u8],
    ['flpTokenAccountBump', u8],
    ['vpVolumeFactor', u8],
  ],
  (args) => args as Pool
);

export const pool2Struct = new BeetStruct<Pool>(
  [
    ['buffer', blob(8)],
    ['nameLength', u32],
    ['name', uniformFixedSizeArray(u8, 9)],
    ['permissions', permissionsStruct],
    ['inceptionTime', i64],
    ['flpMint', publicKey],
    ['oracleAuthority', publicKey],
    ['flpTokenAccount', publicKey],
    ['rewardCustody', publicKey],
    ['custodiesLength', u32],
    ['custodies', uniformFixedSizeArray(publicKey, 6)],
    ['ratiosLength', u32],
    ['ratios', uniformFixedSizeArray(tokenRatiosStruct, 6)],
    ['marketsLength', u32],
    ['markets', uniformFixedSizeArray(publicKey, 10)],
    ['maxAumUsd', u128],
    ['aumUsd', u128],
    ['totalStaked', stakeStatsStruct],
    ['stakingFeeShareBps', u64],
    ['bump', u8],
    ['flpMintBump', u8],
    ['flpTokenAccountBump', u8],
    ['vpVolumeFactor', u8],
  ],
  (args) => args as Pool
);

export const pool3Struct = new BeetStruct<Pool>(
  [
    ['buffer', blob(8)],
    ['nameLength', u32],
    ['name', uniformFixedSizeArray(u8, 12)],
    ['permissions', permissionsStruct],
    ['inceptionTime', i64],
    ['flpMint', publicKey],
    ['oracleAuthority', publicKey],
    ['flpTokenAccount', publicKey],
    ['rewardCustody', publicKey],
    ['custodiesLength', u32],
    ['custodies', uniformFixedSizeArray(publicKey, 5)],
    ['ratiosLength', u32],
    ['ratios', uniformFixedSizeArray(tokenRatiosStruct, 5)],
    ['marketsLength', u32],
    ['markets', uniformFixedSizeArray(publicKey, 8)],
    ['maxAumUsd', u128],
    ['aumUsd', u128],
    ['totalStaked', stakeStatsStruct],
    ['stakingFeeShareBps', u64],
    ['bump', u8],
    ['flpMintBump', u8],
    ['flpTokenAccountBump', u8],
    ['vpVolumeFactor', u8],
  ],
  (args) => args as Pool
);
