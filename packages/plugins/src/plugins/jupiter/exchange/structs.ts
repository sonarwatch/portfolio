import {
  BeetStruct,
  FixableBeetStruct,
  bool,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { blob, i64, u128, u64 } from '../../../utils/solana';

export type LimitOrder = {
  buffer: Buffer;
  maker: PublicKey;
  inputMint: PublicKey;
  outputMint: PublicKey;
  waiting: boolean;
  oriMakingAmount: BigNumber;
  oriTakingAmount: BigNumber;
  makingAmount: BigNumber;
  takingAmount: BigNumber;
  makerInputAccount: PublicKey;
  makerOutputAccount: PublicKey;
  reserve: PublicKey;
  uid: BigNumber;
  expiredAt: BigNumber;
  base: PublicKey;
  referral: PublicKey;
};

export const limitOrderStruct = new BeetStruct<LimitOrder>(
  [
    ['buffer', blob(8)],
    ['maker', publicKey],
    ['inputMint', publicKey],
    ['outputMint', publicKey],
    ['waiting', bool],
    ['oriMakingAmount', u64],
    ['oriTakingAmount', u64],
    ['makingAmount', u64],
    ['takingAmount', u64],
    ['makerInputAccount', publicKey],
    ['makerOutputAccount', publicKey],
    ['reserve', publicKey],
    ['uid', u64],
    ['expiredAt', i64],
    ['base', publicKey],
    ['referral', publicKey],
  ],
  (args) => args as LimitOrder
);

export type LimitOrderV2 = {
  buffer: Buffer;
  maker: PublicKey;
  inputMint: PublicKey;
  outputMint: PublicKey;
  inputTokenProgram: PublicKey;
  outputTokenProgram: PublicKey;
  inputMintReserve: PublicKey;
  uniqueId: boolean;
  oriMakingAmount: BigNumber;
  oriTakingAmount: BigNumber;
  makingAmount: BigNumber;
  takingAmount: BigNumber;
  borrowMakingAmount: BigNumber;
  expiredAt: BigNumber;
  feeBps: number;
  feeAccount: PublicKey;
  createdAt: BigNumber;
  updatedAt: BigNumber;
  bump: number;
};

export const limitOrderV2Struct = new BeetStruct<LimitOrderV2>(
  [
    ['buffer', blob(8)],
    ['maker', publicKey],
    ['inputMint', publicKey],
    ['outputMint', publicKey],
    ['inputTokenProgram', publicKey],
    ['outputTokenProgram', publicKey],
    ['inputMintReserve', publicKey],
    ['uniqueId', u64],
    ['oriMakingAmount', u64],
    ['oriTakingAmount', u64],
    ['makingAmount', u64],
    ['takingAmount', u64],
    ['borrowMakingAmount', u64],
    ['expiredAt', i64],
    ['feeBps', u16],
    ['feeAccount', publicKey],
    ['createdAt', i64],
    ['updatedAt', i64],
    ['bump', u8],
  ],
  (args) => args as LimitOrderV2
);

export type DCA = {
  buffer: Buffer;
  user: PublicKey;
  inputMint: PublicKey;
  outputMint: PublicKey;
  idx: BigNumber;
  nextCycleAt: BigNumber;
  inDeposited: BigNumber;
  inWithdrawn: BigNumber;
  outWithdrawn: BigNumber;
  inUsed: BigNumber;
  outReceived: BigNumber;
  inAmountPerCycle: BigNumber;
  cycleFrequency: BigNumber;
  nextCycleAmountLeft: BigNumber;
  inAccount: PublicKey;
  outAccount: PublicKey;
  minOutAmount: BigNumber;
  maxOutAmount: BigNumber;
  keeperInBalanceBeforeBorrow: BigNumber;
  dcaOutBalanceBeforeSwap: BigNumber;
  createdAt: BigNumber;
  bump: number;
};

export const dcaStruct = new BeetStruct<DCA>(
  [
    ['buffer', blob(8)],
    ['user', publicKey],
    ['inputMint', publicKey],
    ['outputMint', publicKey],
    ['idx', u64],
    ['nextCycleAt', i64],
    ['inDeposited', u64],
    ['inWithdrawn', u64],
    ['outWithdrawn', u64],
    ['inUsed', u64],
    ['outReceived', u64],
    ['inAmountPerCycle', u64],
    ['cycleFrequency', i64],
    ['nextCycleAmountLeft', u64],
    ['inAccount', publicKey],
    ['outAccount', publicKey],
    ['minOutAmount', u64],
    ['maxOutAmount', u64],
    ['keeperInBalanceBeforeBorrow', u64],
    ['dcaOutBalanceBeforeSwap', u64],
    ['createdAt', i64],
    ['bump', u8],
  ],
  (args) => args as DCA
);

export type ValueAverage = {
  buffer: Buffer;
  isStale: boolean;
  idx: BigNumber;
  bump: number;
  user: PublicKey;
  inputMint: PublicKey;
  outputMint: PublicKey;
  incrementUsdcValue: BigNumber;
  orderInterval: BigNumber;
  inputVault: PublicKey;
  outputVault: PublicKey;
  autoWithdraw: boolean;
  feeDataAccount: PublicKey;
  referralFeeAccount: PublicKey;
  createdAt: BigNumber;
  inDeposited: BigNumber;
  inLeft: BigNumber;
  inUsed: BigNumber;
  inWithdrawn: BigNumber;
  outReceived: BigNumber;
  outWithdrawn: BigNumber;
  supposedUsdcValue: BigNumber;
  nextOrderAt: BigNumber;
  outBalanceBeforeSwap: BigNumber;
};

export const valueAverageStruct = new BeetStruct<ValueAverage>(
  [
    ['buffer', blob(8)],
    ['isStale', bool],
    ['idx', u64],
    ['bump', u8],
    ['user', publicKey],
    ['inputMint', publicKey],
    ['outputMint', publicKey],
    ['incrementUsdcValue', u64],
    ['orderInterval', i64],
    ['inputVault', publicKey],
    ['outputVault', publicKey],
    ['autoWithdraw', bool],
    ['feeDataAccount', publicKey],
    ['referralFeeAccount', publicKey],
    ['createdAt', i64],
    ['inDeposited', u64],
    ['inLeft', u64],
    ['inUsed', u64],
    ['inWithdrawn', u64],
    ['outReceived', u64],
    ['outWithdrawn', u64],
    ['supposedUsdcValue', u64],
    ['nextOrderAt', i64],
    ['outBalanceBeforeSwap', u64],
  ],
  (args) => args as ValueAverage
);

export type VestingEscrow = {
  buffer: Buffer;
  recipient: PublicKey;
  tokenMint: PublicKey;
  creator: PublicKey;
  base: PublicKey;
  escrowBump: number;
  updateRecipientMode: number;
  cancelMode: number;
  tokenProgramFlag: number;
  padding0: number[];
  cliffTime: BigNumber;
  frequency: BigNumber;
  cliffUnlockAmount: BigNumber;
  amountPerPeriod: BigNumber;
  numberOfPeriod: BigNumber;
  totalClaimedAmount: BigNumber;
  vestingStartTime: BigNumber;
  padding: BigNumber[];
};

export const vestingEscrowStruct = new BeetStruct<VestingEscrow>(
  [
    ['buffer', blob(8)],
    ['recipient', publicKey],
    ['tokenMint', publicKey],
    ['creator', publicKey],
    ['base', publicKey],
    ['escrowBump', u8],
    ['updateRecipientMode', u8],
    ['cancelMode', u8],
    ['tokenProgramFlag', u8],
    ['padding0', uniformFixedSizeArray(u8, 4)],
    ['cliffTime', u64],
    ['frequency', u64],
    ['cliffUnlockAmount', u64],
    ['amountPerPeriod', u64],
    ['numberOfPeriod', u64],
    ['totalClaimedAmount', u64],
    ['vestingStartTime', u64],
    ['padding', uniformFixedSizeArray(u128, 6)],
  ],
  (args) => args as VestingEscrow
);

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
