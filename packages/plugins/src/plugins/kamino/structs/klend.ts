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
import { blob, i64, u128, u64 } from '../../../utils/solana';

export type BigFractionBytes = {
  value0: BigNumber;
  value1: BigNumber;
  value2: BigNumber;
  value3: BigNumber;
  padding: BigNumber;
  padding1: BigNumber;
};
export const bigFractionBytesStruct = new BeetStruct<BigFractionBytes>(
  [
    ['value0', u64],
    ['value1', u64],
    ['value2', u64],
    ['value3', u64],
    ['padding', u64],
    ['padding1', u64],
  ],
  (args) => args as BigFractionBytes
);
export type ObligationLiquidity = {
  borrowReserve: PublicKey;
  cumulativeBorrowRateBsf: BigFractionBytes;
  padding: BigNumber;
  borrowedAmountSf: BigNumber;
  marketValueSf: BigNumber;
  borrowFactorAdjustedMarketValueSf: BigNumber;
  padding2: BigNumber[];
};

export const obligationLiquidityStruct = new BeetStruct<ObligationLiquidity>(
  [
    ['borrowReserve', publicKey],
    ['cumulativeBorrowRateBsf', bigFractionBytesStruct],
    ['padding', u64],
    ['borrowedAmountSf', u128],
    ['marketValueSf', u128],
    ['borrowFactorAdjustedMarketValueSf', u128],
    ['padding2', uniformFixedSizeArray(u64, 8)],
  ],
  (args) => args as ObligationLiquidity
);

export type ObligationCollateral = {
  depositReserve: PublicKey;
  depositedAmount: BigNumber;
  marketValueSf: BigNumber;
  padding: BigNumber[];
};

export const obligationCollateralStruct = new BeetStruct<ObligationCollateral>(
  [
    ['depositReserve', publicKey],
    ['depositedAmount', u64],
    ['marketValueSf', u128],
    ['padding', uniformFixedSizeArray(u64, 10)],
  ],
  (args) => args as ObligationCollateral
);

export type LastUpdate = {
  slot: BigNumber;
  stale: number;
  placeholder: number[];
};

export const lastUpdateStruct = new BeetStruct<LastUpdate>(
  [
    ['slot', u64],
    ['stale', u8],
    ['placeholder', uniformFixedSizeArray(u8, 7)],
  ],
  (args) => args as LastUpdate
);
export type Obligation = {
  buffer: Buffer;
  tag: BigNumber;
  lastUpdate: LastUpdate;
  lendingMarket: PublicKey;
  owner: PublicKey;
  deposits: ObligationCollateral[];
  lowestReserveDepositLtv: BigNumber;
  depositedValueSf: BigNumber;
  borrows: ObligationLiquidity[];
  borrowFactorAdjustedDebtValueSf: BigNumber;
  borrowedAssetsMarketValueSf: BigNumber;
  allowedBorrowValueSf: BigNumber;
  unhealthyBorrowValueSf: BigNumber;
  depositsAssetTiers: number[];
  borrowsAssetTiers: number[];
  elevationGroup: number;
  reserved: number;
  referrer: PublicKey;
  padding3: BigNumber[];
};

export const obligationStruct = new BeetStruct<Obligation>(
  [
    ['buffer', blob(8)], // 8 + 64 + 64 + 8 + 8*7 + 32
    ['tag', u64],
    ['lastUpdate', lastUpdateStruct],
    ['lendingMarket', publicKey],
    ['owner', publicKey],
    ['deposits', uniformFixedSizeArray(obligationCollateralStruct, 8)],
    ['lowestReserveDepositLtv', u64],
    ['depositedValueSf', u128],
    ['borrows', uniformFixedSizeArray(obligationLiquidityStruct, 5)],
    ['borrowFactorAdjustedDebtValueSf', u128],
    ['borrowedAssetsMarketValueSf', u128],
    ['allowedBorrowValueSf', u128],
    ['unhealthyBorrowValueSf', u128],
    ['depositsAssetTiers', uniformFixedSizeArray(u8, 8)],
    ['borrowsAssetTiers', uniformFixedSizeArray(u8, 5)],
    ['elevationGroup', u8],
    ['reserved', uniformFixedSizeArray(u8, 2)],
    ['referrer', publicKey],
    ['padding3', uniformFixedSizeArray(u64, 128)],
  ],
  (args) => args as Obligation
);

export type ElevationGroup = {
  maxLiquidationBonusBps: number;
  id: number;
  ltvPct: number;
  liquidationThresholdPct: number;
  allowNewLoans: number;
  reserved: number[];
  padding: Buffer;
};

export const elevationGroupStruct = new BeetStruct<ElevationGroup>(
  [
    ['maxLiquidationBonusBps', u16],
    ['id', u8],
    ['ltvPct', u8],
    ['liquidationThresholdPct', u8],
    ['allowNewLoans', u8],
    ['reserved', uniformFixedSizeArray(u8, 2)],
    ['padding', blob(512 / 8)], // initially u64[8]
  ],
  (args) => args as ElevationGroup
);

export type LendingMarket = {
  buffer: Buffer;
  version: BigNumber;
  bumpSeed: BigNumber;
  lendingMarketOwner: PublicKey;
  lendingMarketOwnerCached: PublicKey;
  quoteCurrency: number[];
  referralFeeBps: number;
  emergencyMode: number;
  reserved: number[];
  priceRefreshTriggerToMaxAgePct: number;
  liquidationMaxDebtCloseFactorPct: number;
  insolvencyRiskUnhealthyLtvPct: number;
  minFullLiquidationAmountThreshold: BigNumber;
  maxLiquidatableDebtMarketValueAtOnce: BigNumber;
  globalUnhealthyBorrowValue: BigNumber;
  globalAllowedBorrowValue: BigNumber;
  riskCouncil: PublicKey;
  multiplierPointsTagBoost: number[];
  elevationGroups: ElevationGroup[];
  elevationGroupPadding: BigNumber[];
  padding1: BigNumber[];
};

export const lendingMarketStruct = new BeetStruct<LendingMarket>(
  [
    ['buffer', blob(8)],
    ['version', u64],
    ['bumpSeed', u64],
    ['lendingMarketOwner', publicKey],
    ['lendingMarketOwnerCached', publicKey],
    ['quoteCurrency', uniformFixedSizeArray(u8, 32)],
    ['referralFeeBps', u16],
    ['emergencyMode', u8],
    ['reserved', uniformFixedSizeArray(u8, 2)],
    ['priceRefreshTriggerToMaxAgePct', u8],
    ['liquidationMaxDebtCloseFactorPct', u8],
    ['insolvencyRiskUnhealthyLtvPct', u8],
    ['minFullLiquidationAmountThreshold', u64],
    ['maxLiquidatableDebtMarketValueAtOnce', u64],
    ['globalUnhealthyBorrowValue', u64],
    ['globalAllowedBorrowValue', u64],
    ['riskCouncil', publicKey],
    ['multiplierPointsTagBoost', uniformFixedSizeArray(u8, 8)],
    ['elevationGroups', uniformFixedSizeArray(elevationGroupStruct, 32)],
    ['elevationGroupPadding', uniformFixedSizeArray(u64, 90)],
    ['padding1', uniformFixedSizeArray(u64, 180)],
  ],
  (args) => args as LendingMarket
);

export type WithdrawalCaps = {
  configCapacity: BigNumber;
  currentTotal: BigNumber;
  lastIntervalStartTimestamp: BigNumber;
  configIntervalLengthSeconds: BigNumber;
};
export const withdrawalCapsStruct = new BeetStruct<WithdrawalCaps>(
  [
    ['configCapacity', i64],
    ['currentTotal', i64],
    ['lastIntervalStartTimestamp', u64],
    ['configIntervalLengthSeconds', u64],
  ],
  (args) => args as WithdrawalCaps
);

export type PythConfiguration = {
  price: PublicKey;
};
export const pythConfigurationStruct = new BeetStruct<PythConfiguration>(
  [['price', publicKey]],
  (args) => args as PythConfiguration
);

export type SwitchboardConfiguration = {
  priceAggregator: PublicKey;
  twapAggregator: PublicKey;
};
export const switchboardConfigurationStruct =
  new BeetStruct<SwitchboardConfiguration>(
    [
      ['priceAggregator', publicKey],
      ['twapAggregator', publicKey],
    ],
    (args) => args as SwitchboardConfiguration
  );

export type ScopeConfiguration = {
  priceFeed: PublicKey;
  priceChain: number[];
  twapChain: number[];
};
export const scopeConfigurationStruct = new BeetStruct<ScopeConfiguration>(
  [
    ['priceFeed', publicKey],
    ['priceChain', uniformFixedSizeArray(u16, 4)],
    ['twapChain', uniformFixedSizeArray(u16, 4)],
  ],
  (args) => args as ScopeConfiguration
);

export type PriceHeuristic = {
  lower: BigNumber;
  upper: BigNumber;
  exp: BigNumber;
};
export const priceHeuristicStruct = new BeetStruct<PriceHeuristic>(
  [
    ['lower', u64],
    ['upper', u64],
    ['exp', u64],
  ],
  (args) => args as PriceHeuristic
);

export type TokenInfo = {
  name: number[];
  heuristic: PriceHeuristic;
  maxTwapDivergenceBps: BigNumber;
  maxAgePriceSeconds: BigNumber;
  maxAgeTwapSeconds: BigNumber;
  scopeConfiguration: ScopeConfiguration;
  switchboardConfiguration: SwitchboardConfiguration;
  pythConfiguration: PythConfiguration;
  padding: Buffer;
};
export const tokenInfoStruct = new BeetStruct<TokenInfo>(
  [
    ['name', uniformFixedSizeArray(u8, 32)],
    ['heuristic', priceHeuristicStruct],
    ['maxTwapDivergenceBps', u64],
    ['maxAgePriceSeconds', u64],
    ['maxAgeTwapSeconds', u64],
    ['scopeConfiguration', scopeConfigurationStruct],
    ['switchboardConfiguration', switchboardConfigurationStruct],
    ['pythConfiguration', pythConfigurationStruct],
    ['padding', blob((64 * 20) / 8)],
  ],
  (args) => args as TokenInfo
);

export type CurvePoint = {
  utilizationRateBps: number;
  borrowRateBps: number;
};
export const CurvePointStruct = new BeetStruct<CurvePoint>(
  [
    ['utilizationRateBps', u32],
    ['borrowRateBps', u32],
  ],
  (args) => args as CurvePoint
);

export type BorrowRateCurve = {
  points: CurvePoint[];
};
export const borrowRateCurveStruct = new FixableBeetStruct<BorrowRateCurve>(
  [['points', uniformFixedSizeArray(CurvePointStruct, 11)]],
  (args) => args as BorrowRateCurve
);

export type ReserveFees = {
  borrowFeeSf: BigNumber;
  flashLoanFeeSf: BigNumber;
  padding: number[];
};
export const reserveFeesStruct = new BeetStruct<ReserveFees>(
  [
    ['borrowFeeSf', u64],
    ['flashLoanFeeSf', u64],
    ['padding', uniformFixedSizeArray(u8, 8)],
  ],
  (args) => args as ReserveFees
);

export type ReserveConfig = {
  status: number;
  assetTier: number;
  reserved0: number[];
  multiplierSideBoost: number[];
  multiplierTagBoost: number[];
  protocolTakeRatePct: number;
  protocolLiquidationFeePct: number;
  loanToValuePct: number;
  liquidationThresholdPct: number;
  minLiquidationBonusBps: number;
  maxLiquidationBonusBps: number;
  badDebtLiquidationBonusBps: number;
  deleveragingMarginCallPeriodSecs: BigNumber;
  deleveragingThresholdSlotsPerBps: BigNumber;
  fees: ReserveFees;
  borrowRateCurve: BorrowRateCurve;
  borrowFactorPct: BigNumber;
  depositLimit: BigNumber;
  borrowLimit: BigNumber;
  tokenInfo: TokenInfo;
  depositWithdrawalCap: WithdrawalCaps;
  debtWithdrawalCap: WithdrawalCaps;
  elevationGroups: number[];
  reserved1: number[];
};
export const reserveConfigStruct = new FixableBeetStruct<ReserveConfig>(
  [
    ['status', u8],
    ['assetTier', u8],
    ['reserved0', uniformFixedSizeArray(u8, 2)],
    ['multiplierSideBoost', uniformFixedSizeArray(u8, 2)],
    ['multiplierTagBoost', uniformFixedSizeArray(u8, 8)],
    ['protocolTakeRatePct', u8],
    ['protocolLiquidationFeePct', u8],
    ['loanToValuePct', u8],
    ['liquidationThresholdPct', u8],
    ['minLiquidationBonusBps', u16],
    ['maxLiquidationBonusBps', u16],
    ['badDebtLiquidationBonusBps', u16],
    ['deleveragingMarginCallPeriodSecs', u64],
    ['deleveragingThresholdSlotsPerBps', u64],
    ['fees', reserveFeesStruct],
    ['borrowRateCurve', borrowRateCurveStruct],
    ['borrowFactorPct', u64],
    ['depositLimit', u64],
    ['borrowLimit', u64],
    ['tokenInfo', tokenInfoStruct],
    ['depositWithdrawalCap', withdrawalCapsStruct],
    ['debtWithdrawalCap', withdrawalCapsStruct],
    ['elevationGroups', uniformFixedSizeArray(u8, 20)],
    ['reserved1', uniformFixedSizeArray(u8, 4)],
  ],
  (args) => args as ReserveConfig
);

export type ReserveCollateral = {
  mintPubkey: PublicKey;
  mintTotalSupply: BigNumber;
  supplyVault: PublicKey;
  padding1: BigNumber[];
  padding2: BigNumber[];
};
export const reserveCollateralStruct = new BeetStruct<ReserveCollateral>(
  [
    ['mintPubkey', publicKey],
    ['mintTotalSupply', u64],
    ['supplyVault', publicKey],
    ['padding1', uniformFixedSizeArray(u128, 32)],
    ['padding2', uniformFixedSizeArray(u128, 32)],
  ],
  (args) => args as ReserveCollateral
);

export type ReserveLiquidity = {
  mintPubkey: PublicKey;
  supplyVault: PublicKey;
  feeVault: PublicKey;
  availableAmount: BigNumber;
  borrowedAmountSf: BigNumber;
  marketPriceSf: BigNumber;
  marketPriceLastUpdatedTs: BigNumber;
  mintDecimals: BigNumber;
  depositLimitCrossedSlot: BigNumber;
  borrowLimitCrossedSlot: BigNumber;
  cumulativeBorrowRateBsf: BigFractionBytes;
  accumulatedProtocolFeesSf: BigNumber;
  accumulatedReferrerFeesSf: BigNumber;
  pendingReferrerFeesSf: BigNumber;
  absoluteReferralRateSf: BigNumber;
  padding2: BigNumber[];
  padding3: BigNumber[];
};
export const reserveLiquidityStruct = new BeetStruct<ReserveLiquidity>(
  [
    ['mintPubkey', publicKey],
    ['supplyVault', publicKey],
    ['feeVault', publicKey],
    ['availableAmount', u64],
    ['borrowedAmountSf', u128],
    ['marketPriceSf', u128],
    ['marketPriceLastUpdatedTs', u64],
    ['mintDecimals', u64],
    ['depositLimitCrossedSlot', u64],
    ['borrowLimitCrossedSlot', u64],
    ['cumulativeBorrowRateBsf', bigFractionBytesStruct],
    ['accumulatedProtocolFeesSf', u128],
    ['accumulatedReferrerFeesSf', u128],
    ['pendingReferrerFeesSf', u128],
    ['absoluteReferralRateSf', u128],
    ['padding2', uniformFixedSizeArray(u64, 55)],
    ['padding3', uniformFixedSizeArray(u128, 32)],
  ],
  (args) => args as ReserveLiquidity
);

export type Reserve = {
  buffer: Buffer;
  version: BigNumber;
  lastUpdate: LastUpdate;
  lendingMarket: PublicKey;
  farmCollateral: PublicKey;
  farmDebt: PublicKey;
  liquidity: ReserveLiquidity;
  reserveLiquidityPadding: BigNumber[];
  collateral: ReserveCollateral;
  reserveCollateralPadding: BigNumber[];
  config: ReserveConfig;
  configPadding: BigNumber[];
  padding: BigNumber[];
};
export const reserveStruct = new FixableBeetStruct<Reserve>(
  [
    ['buffer', blob(8)],
    ['version', u64],
    ['lastUpdate', lastUpdateStruct],
    ['lendingMarket', publicKey],
    ['farmCollateral', publicKey],
    ['farmDebt', publicKey],
    ['liquidity', reserveLiquidityStruct],
    ['reserveLiquidityPadding', uniformFixedSizeArray(u64, 150)],
    ['collateral', reserveCollateralStruct],
    ['reserveCollateralPadding', uniformFixedSizeArray(u64, 150)],
    ['config', reserveConfigStruct],
    ['configPadding', uniformFixedSizeArray(u64, 150)],
    ['padding', uniformFixedSizeArray(u64, 240)],
  ],
  (args) => args as Reserve
);
