import {
  BeetStruct,
  FixableBeetStruct,
  bool,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type Limit = {
  maxAumUsd: BigNumber;
  maxIndividualLpToken: BigNumber;
  maxPositionUsd: BigNumber;
};

export const limitStruct = new BeetStruct<Limit>(
  [
    ['maxAumUsd', u128],
    ['maxIndividualLpToken', u128],
    ['maxPositionUsd', u64],
  ],
  (args) => args as Limit
);

export type PoolApr = {
  lastUpdated: BigNumber;
  feeAprBps: BigNumber;
  realizedFeeUsd: BigNumber;
};

export const poolAprStruct = new BeetStruct<PoolApr>(
  [
    ['lastUpdated', i64],
    ['feeAprBps', u64],
    ['realizedFeeUsd', u64],
  ],
  (args) => args as PoolApr
);

export type Fees = {
  increasePositionBps: BigNumber;
  decreasePositionBps: BigNumber;
  addRemoveLiquidityBps: BigNumber;
  swapBps: BigNumber;
  taxBps: BigNumber;
  stableSwapBps: BigNumber;
  stableSwapTaxBps: BigNumber;
  liquidationRewardBps: BigNumber;
  protocolShareBps: BigNumber;
};

export const feesStruct = new BeetStruct<Fees>(
  [
    ['increasePositionBps', u64],
    ['decreasePositionBps', u64],
    ['addRemoveLiquidityBps', u64],
    ['swapBps', u64],
    ['taxBps', u64],
    ['stableSwapBps', u64],
    ['stableSwapTaxBps', u64],
    ['liquidationRewardBps', u64],
    ['protocolShareBps', u64],
  ],
  (args) => args as Fees
);

export type PerpetualPool = {
  buffer: Buffer;
  name: number;
  custodies: PublicKey[];
  aumUsd: BigNumber;
  limit: Limit;
  fees: Fees;
  poolApr: PoolApr;
  maxRequestExecutionSec: BigNumber;
  bump: number;
  lpTokenBump: number;
  inceptionTime: BigNumber;
};

export const perpetualPoolStruct = new FixableBeetStruct<PerpetualPool>(
  [
    ['buffer', blob(8)],
    ['name', blob(12)],
    ['custodies', uniformFixedSizeArray(publicKey, 5)],
    ['aumUsd', u128],
    ['limit', limitStruct],
    ['fees', feesStruct],
    ['poolApr', poolAprStruct],
    ['maxRequestExecutionSec', i64],
    ['bump', u8],
    ['lpTokenBump', u8],
    ['inceptionTime', i64],
  ],
  (args) => args as PerpetualPool
);

export enum OracleType {
  None,
  Test,
  Pyth,
}

export type OracleParams = {
  oracleAccount: PublicKey;
  oracleType: OracleType;
  maxPriceError: BigNumber;
  maxPriceAgeSec: BigNumber;
};

export const oracleParamsStruct = new BeetStruct<OracleParams>(
  [
    ['oracleAccount', publicKey],
    ['oracleType', u8],
    ['maxPriceError', u64],
    ['maxPriceAgeSec', u32],
  ],
  (args) => args as OracleParams
);

export type PricingParams = {
  tradeSpreadLong: BigNumber;
  tradeSpreadShort: BigNumber;
  swapSpread: BigNumber;
  maxLeverage: BigNumber;
  maxGlobalLongSizes: BigNumber;
  maxGlobalShortSizes: BigNumber;
};

export const pricingParamsStruct = new BeetStruct<PricingParams>(
  [
    ['tradeSpreadLong', u64],
    ['tradeSpreadShort', u64],
    ['swapSpread', u64],
    ['maxLeverage', u64],
    ['maxGlobalLongSizes', u64],
    ['maxGlobalShortSizes', u64],
  ],
  (args) => args as PricingParams
);

export type Permissions = {
  allowSwap: boolean;
  allowAddLiquidity: boolean;
  allowRemoveLiquidity: boolean;
  allowIncreasePosition: boolean;
  allowDecreasePosition: boolean;
  allowCollateralWithdrawal: boolean;
  allowLiquidatePosition: boolean;
};

export const permissionsStruct = new BeetStruct<Permissions>(
  [
    ['allowSwap', bool],
    ['allowAddLiquidity', bool],
    ['allowRemoveLiquidity', bool],
    ['allowIncreasePosition', bool],
    ['allowDecreasePosition', bool],
    ['allowCollateralWithdrawal', bool],
    ['allowLiquidatePosition', bool],
  ],
  (args) => args as Permissions
);

export type Assets = {
  feesReserves: BigNumber;
  owned: BigNumber;
  locked: BigNumber;
  guaranteedUsd: BigNumber;
  globalShortSizes: BigNumber;
  globalShortAveragePrices: BigNumber;
};
export const assetsStruct = new BeetStruct<Assets>(
  [
    ['feesReserves', u64],
    ['owned', u64],
    ['locked', u64],
    ['guaranteedUsd', u64],
    ['globalShortSizes', u64],
    ['globalShortAveragePrices', u64],
  ],
  (args) => args as Assets
);

export type FundingRateState = {
  cumulativeInterestRate: BigNumber;
  lastUpdate: BigNumber;
  hourlyFundingBps: BigNumber;
};
export const fundingRateStateStruct = new BeetStruct<FundingRateState>(
  [
    ['cumulativeInterestRate', u128],
    ['lastUpdate', i64],
    ['hourlyFundingBps', u64],
  ],
  (args) => args as FundingRateState
);

export type Custody = {
  buffer: Buffer;
  pool: PublicKey;
  mint: PublicKey;
  tokenAccount: PublicKey;
  decimals: number;
  isStable: boolean;
  oracle: OracleParams;
  pricing: PricingParams;
  permissions: Permissions;
  targetRatioBps: BigNumber;
  assets: Assets;
  fundingRateState: FundingRateState;
  bump: number;
  tokenAccountBump: number;
  buffer1: Buffer;
};
export const custodyStruct = new BeetStruct<Custody>(
  [
    ['buffer', blob(8)],
    ['pool', publicKey],
    ['mint', publicKey],
    ['tokenAccount', publicKey],
    ['decimals', u8],
    ['isStable', bool],
    ['oracle', oracleParamsStruct],
    ['pricing', pricingParamsStruct],
    ['permissions', permissionsStruct],
    ['targetRatioBps', u64],
    ['assets', assetsStruct],
    ['fundingRateState', fundingRateStateStruct],
    ['bump', u8],
    ['tokenAccountBump', u8],
    ['buffer1', blob(8)],
  ],
  (args) => args as Custody
);

export enum Side {
  None,
  Long,
  Short,
}

export type Position = {
  buffer: Buffer;
  owner: PublicKey;
  pool: PublicKey;
  custody: PublicKey;
  collateralCustody: PublicKey;
  openTime: BigNumber;
  updateTime: BigNumber;
  side: Side;
  price: BigNumber;
  sizeUsd: BigNumber;
  collateralUsd: BigNumber;
  realisedPnlUsd: BigNumber;
  cumulativeInterestSnapshot: BigNumber;
  lockedAmount: BigNumber;
  bump: number;
};

export const positionStruct = new BeetStruct<Position>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['pool', publicKey],
    ['custody', publicKey],
    ['collateralCustody', publicKey],
    ['openTime', i64],
    ['updateTime', i64],
    ['side', u8],
    ['price', u64],
    ['sizeUsd', u64],
    ['collateralUsd', u64],
    ['realisedPnlUsd', i64],
    ['cumulativeInterestSnapshot', u128],
    ['lockedAmount', u64],
    ['bump', u8],
  ],
  (args) => args as Position
);

export type ClaimStatus = {
  buffer: Buffer;
  claimant: PublicKey;
  lockedAmount: BigNumber;
  lockedAmountWithdrawn: BigNumber;
  unlockedAmount: BigNumber;
  closable: Buffer;
  admin: PublicKey;
};

export const claimStatusStruct = new BeetStruct<ClaimStatus>(
  [
    ['buffer', blob(8)],
    ['claimant', publicKey],
    ['lockedAmount', u64],
    ['lockedAmountWithdrawn', u64],
    ['unlockedAmount', u64],
    ['closable', blob(1)],
    ['admin', publicKey],
  ],
  (args) => args as ClaimStatus
);

export type Escrow = {
  buffer: Buffer;
  locker: PublicKey;
  owner: PublicKey;
  bump: number;
  tokens: PublicKey;
  amount: BigNumber;
  escrowStartedAt: BigNumber;
  escrowEndsAt: BigNumber;
  voteDelegate: PublicKey;
  isMaxLock: boolean;
  buffers: BigNumber[];
};

export const escrowStruct = new BeetStruct<Escrow>(
  [
    ['buffer', blob(8)],
    ['locker', publicKey],
    ['owner', publicKey],
    ['bump', u8],
    ['tokens', publicKey],
    ['amount', u64],
    ['escrowStartedAt', i64],
    ['escrowEndsAt', i64],
    ['voteDelegate', publicKey],
    ['isMaxLock', bool],
    ['buffers', uniformFixedSizeArray(u128, 10)],
  ],
  (args) => args as Escrow
);
