import {
  BeetStruct,
  bool,
  i16,
  i32,
  i8,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i128, i64, u128, u64 } from '../../utils/solana';

export enum OrderTriggerCondition {
  Above,
  Below,
  TriggeredAbove,
  TriggeredBelow,
}

export enum PositionDirection {
  Long,
  Short,
}

export enum MarketType {
  Spot,
  Perp,
}

export enum OrderType {
  Market,
  Limit,
  TriggerMarket,
  TriggerLimit,
  Oracle,
}

export enum OrderStatus {
  Init,
  Open,
  Filled,
  Canceled,
}

export enum SpotBalanceType {
  Deposit,
  Borrow,
}

export enum UserStatus {
  Active,
  BeingLiquidated,
  Bankrupt,
}

export enum AssetTier {
  Collateral,
  Protected,
  Cross,
  Isolated,
  Unlisted,
}

export enum MarketStatus {
  Initialized,
  Active,
  FundingPaused,
  AmmPaused,
  FillPaused,
  WithdrawPaused,
  ReduceOnly,
  Settlement,
  Delisted,
}

export enum OracleSource {
  Pyth,
  Switchboard,
  QuoteAsset,
  Pyth1K,
  Pyth1M,
  PythStableCoin,
}

export enum ContractType {
  Perpetual,
  Future,
}

export enum ContractTier {
  A,
  B,
  C,
  Speculative,
  Isolated,
}

export type Order = {
  slot: BigNumber;
  price: BigNumber;
  baseAssetAmount: BigNumber;
  baseAssetAmountFilled: BigNumber;
  quoteAssetAmountFilled: BigNumber;
  triggerPrice: BigNumber;
  auctionStartPrice: BigNumber;
  auctionEndPrice: BigNumber;
  maxTs: BigNumber;
  oraclePriceOffset: BigNumber;
  orderId: BigNumber;
  marketIndex: number;
  status: OrderStatus;
  orderType: OrderType;
  marketType: MarketType;
  userOrderId: number;
  existingPositionDirection: PositionDirection;
  direction: PositionDirection;
  reduceOnly: boolean;
  postOnly: boolean;
  immediateOrCancel: boolean;
  triggerCondition: OrderTriggerCondition;
  auctionDuration: number;
  padding: number;
};

export const orderStruct = new BeetStruct<Order>(
  [
    ['slot', u64],
    ['price', u64],
    ['baseAssetAmount', u64],
    ['baseAssetAmountFilled', u64],
    ['quoteAssetAmountFilled', u64],
    ['triggerPrice', u64],
    ['auctionStartPrice', i64],
    ['auctionEndPrice', i64],
    ['maxTs', i64],
    ['oraclePriceOffset', i32],
    ['orderId', u32],
    ['marketIndex', u16],
    ['status', u8],
    ['orderType', u8],
    ['marketType', u8],
    ['userOrderId', u8],
    ['existingPositionDirection', u8],
    ['direction', u8],
    ['reduceOnly', bool],
    ['postOnly', bool],
    ['immediateOrCancel', bool],
    ['triggerCondition', u8],
    ['auctionDuration', u8],
    ['padding', u8],
  ],
  (args) => args as Order
);

export type PerpPosition = {
  lastCumulativeFundingRate: BigNumber;
  baseAssetAmount: BigNumber;
  quoteAssetAmount: BigNumber;
  quoteBreakEvenAmount: BigNumber;
  quoteEntryAmount: BigNumber;
  openBids: BigNumber;
  openAsks: BigNumber;
  settledPnl: BigNumber;
  lpShares: BigNumber;
  lastBaseAssetAmountPerLp: BigNumber;
  lastQuoteAssetAmountPerLp: BigNumber;
  remainderBaseAssetAmount: BigNumber;
  marketIndex: number;
  openOrders: number;
  padding: number[];
};

export const perpPositionStruct = new BeetStruct<PerpPosition>(
  [
    ['lastCumulativeFundingRate', i64],
    ['baseAssetAmount', i64],
    ['quoteAssetAmount', i64],
    ['quoteBreakEvenAmount', i64],
    ['quoteEntryAmount', i64],
    ['openBids', i64],
    ['openAsks', i64],
    ['settledPnl', i64],
    ['lpShares', u64],
    ['lastBaseAssetAmountPerLp', i64],
    ['lastQuoteAssetAmountPerLp', i64],
    ['remainderBaseAssetAmount', i32],
    ['marketIndex', u16],
    ['openOrders', u8],
    ['padding', uniformFixedSizeArray(u8, 1)],
  ],
  (args) => args as PerpPosition
);

export type PoolBalance = {
  scaledBalance: BigNumber;
  marketIndex: number;
  padding: number[];
};

export const poolBalanceStruct = new BeetStruct<PoolBalance>(
  [
    ['scaledBalance', u128],
    ['marketIndex', u16],
    ['padding', uniformFixedSizeArray(u8, 6)],
  ],
  (args) => args as PoolBalance
);

export type HistoricalIndexData = {
  lastIndexBidPrice: BigNumber;
  lastIndexAskPrice: BigNumber;
  lastIndexPriceTwap: BigNumber;
  lastIndexPriceTwap5min: BigNumber;
  lastIndexPriceTwapTs: BigNumber;
};

export const historicalIndexDataStruct = new BeetStruct<HistoricalIndexData>(
  [
    ['lastIndexBidPrice', u64],
    ['lastIndexAskPrice', u64],
    ['lastIndexPriceTwap', u64],
    ['lastIndexPriceTwap5min', u64],
    ['lastIndexPriceTwapTs', i64],
  ],
  (args) => args as HistoricalIndexData
);

export type HistoricalOracleData = {
  lastOraclePrice: BigNumber;
  lastOracleConf: BigNumber;
  lastOracleDelay: BigNumber;
  lastOraclePriceTwap: BigNumber;
  lastOraclePriceTwap5Min: BigNumber;
  lastOraclePriceTwapTs: BigNumber;
};

export const historicalOracleDataStruct = new BeetStruct<HistoricalOracleData>(
  [
    ['lastOraclePrice', i64],
    ['lastOracleConf', u64],
    ['lastOracleDelay', i64],
    ['lastOraclePriceTwap', i64],
    ['lastOraclePriceTwap5Min', i64],
    ['lastOraclePriceTwapTs', i64],
  ],
  (args) => args as HistoricalOracleData
);

export type InsuranceFund = {
  vault: PublicKey;
  totalShares: BigNumber;
  userShares: BigNumber;
  sharesBase: BigNumber;
  unstakingPeriod: BigNumber;
  lastRevenueSettleTs: BigNumber;
  revenueSettlePeriod: BigNumber;
  totalFactor: number;
  userFactor: number;
};

export const insuranceFundStruct = new BeetStruct<InsuranceFund>(
  [
    ['vault', publicKey],
    ['totalShares', u128],
    ['userShares', u128],
    ['sharesBase', u128],
    ['unstakingPeriod', i64],
    ['lastRevenueSettleTs', i64],
    ['revenueSettlePeriod', i64],
    ['totalFactor', u32],
    ['userFactor', u32],
  ],
  (args) => args as InsuranceFund
);

export type SpotMarket = {
  buffer: Buffer;
  pubkey: PublicKey;
  oracle: PublicKey;
  mint: PublicKey;
  vault: PublicKey;
  name: number[];
  historicalOracleData: HistoricalOracleData;
  historicalIndexData: HistoricalIndexData;
  revenuePool: PoolBalance;
  spotFeePool: PoolBalance;
  insuranceFund: InsuranceFund;
  totalSpotFee: BigNumber;
  depositBalance: BigNumber;
  borrowBalance: BigNumber;
  cumulativeDepositInterest: BigNumber;
  cumulativeBorrowInterest: BigNumber;
  totalSocialLoss: BigNumber;
  totalQuoteSocialLoss: BigNumber;
  withdrawGuardThreshold: BigNumber;
  maxTokenDeposits: BigNumber;
  depositTokenTwap: BigNumber;
  borrowTokenTwap: BigNumber;
  utilizationTwap: BigNumber;
  lastInterestTs: BigNumber;
  lastTwapTs: BigNumber;
  expiryTs: BigNumber;
  orderStepSize: BigNumber;
  orderTickSize: BigNumber;
  minOrderSize: BigNumber;
  maxPositionSize: BigNumber;
  nextFillRecordId: BigNumber;
  nextDepositRecordId: BigNumber;
  initialAssetWeight: number;
  maintenanceAssetWeight: number;
  initialLiabilityWeight: number;
  maintenanceLiabilityWeight: number;
  imfFactor: number;
  liquidatorFee: number;
  ifLiquidationFee: number;
  optimalUtilization: number;
  optimalBorrowRate: number;
  maxBorrowRate: number;
  decimals: number;
  marketIndex: number;
  ordersEnabled: boolean;
  oracleSource: OracleSource;
  status: MarketStatus;
  assetTier: AssetTier;
  padding1: number[];
  flashLoanAmount: BigNumber;
  flashLoanInitialTokenAmount: BigNumber;
  totalSwapFee: BigNumber;
  padding: Buffer[];
};

export const spotMarketStruct = new BeetStruct<SpotMarket>(
  [
    ['buffer', blob(8)],
    ['pubkey', publicKey],
    ['oracle', publicKey],
    ['mint', publicKey],
    ['vault', publicKey],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['historicalOracleData', historicalOracleDataStruct],
    ['historicalIndexData', historicalIndexDataStruct],
    ['revenuePool', poolBalanceStruct],
    ['spotFeePool', poolBalanceStruct],
    ['insuranceFund', insuranceFundStruct],
    ['totalSpotFee', u128],
    ['depositBalance', u128],
    ['borrowBalance', u128],
    ['cumulativeDepositInterest', u128],
    ['cumulativeBorrowInterest', u128],
    ['totalSocialLoss', u128],
    ['totalQuoteSocialLoss', u128],
    ['withdrawGuardThreshold', u64],
    ['maxTokenDeposits', u64],
    ['depositTokenTwap', u64],
    ['borrowTokenTwap', u64],
    ['utilizationTwap', u64],
    ['lastInterestTs', u64],
    ['lastTwapTs', u64],
    ['expiryTs', i64],
    ['orderStepSize', u64],
    ['orderTickSize', u64],
    ['minOrderSize', u64],
    ['maxPositionSize', u64],
    ['nextFillRecordId', u64],
    ['nextDepositRecordId', u64],
    ['initialAssetWeight', u32],
    ['maintenanceAssetWeight', u32],
    ['initialLiabilityWeight', u32],
    ['maintenanceLiabilityWeight', u32],
    ['imfFactor', u32],
    ['liquidatorFee', u32],
    ['ifLiquidationFee', u32],
    ['optimalUtilization', u32],
    ['optimalBorrowRate', u32],
    ['maxBorrowRate', u32],
    ['decimals', u32],
    ['marketIndex', u16],
    ['ordersEnabled', bool],
    ['oracleSource', u8],
    ['status', u8],
    ['assetTier', u8],
    ['padding1', uniformFixedSizeArray(u8, 6)],
    ['flashLoanAmount', u64],
    ['flashLoanInitialTokenAmount', u64],
    ['totalSwapFee', u64],
    ['padding', uniformFixedSizeArray(u8, 56)],
  ],
  (args) => args as SpotMarket
);

export type SpotPosition = {
  scaledBalance: BigNumber;
  openBids: BigNumber;
  openAsks: BigNumber;
  cumulativeDeposits: BigNumber;
  marketIndex: number;
  balanceType: SpotBalanceType;
  openOrders: number;
  padding: number[];
};
export const spotPositionStruct = new BeetStruct<SpotPosition>(
  [
    ['scaledBalance', u64],
    ['openBids', i64],
    ['openAsks', i64],
    ['cumulativeDeposits', i64],
    ['marketIndex', u16],
    ['balanceType', u8],
    ['openOrders', u8],
    ['padding', uniformFixedSizeArray(u8, 4)],
  ],
  (args) => args as SpotPosition
);

export type UserAccount = {
  buffer: Buffer;
  authority: PublicKey;
  delegate: PublicKey;
  name: number[];
  spotPositions: SpotPosition[];
  perpPositions: PerpPosition[];
  orders: Order[];
  lastAddPerpLpSharesTs: BigNumber;
  totalDeposits: BigNumber;
  totalWithdraws: BigNumber;
  totalSocialLoss: BigNumber;
  settledPerpPnl: BigNumber;
  cumulativeSpotFees: BigNumber;
  cumulativePerpFunding: BigNumber;
  liquidationMarginFreed: BigNumber;
  lastActiveSlot: BigNumber;
  nextOrderId: number;
  maxMarginRatio: number;
  nextLiquidationId: number;
  subAccountId: number;
  status: UserStatus;
  isMarginTradingEnabled: boolean;
  idle: boolean;
  openOrders: number;
  hasOpenOrder: boolean;
  openAuctions: number;
  hasOpenAuction: boolean;
  padding: number[];
};

export const userAccountStruct = new BeetStruct<UserAccount>(
  [
    ['buffer', blob(8)],
    ['authority', publicKey],
    ['delegate', publicKey],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['spotPositions', uniformFixedSizeArray(spotPositionStruct, 8)],
    ['perpPositions', uniformFixedSizeArray(perpPositionStruct, 8)],
    ['orders', uniformFixedSizeArray(orderStruct, 32)],
    ['lastAddPerpLpSharesTs', i64],
    ['totalDeposits', u64],
    ['totalWithdraws', u64],
    ['totalSocialLoss', u64],
    ['settledPerpPnl', i64],
    ['cumulativeSpotFees', i64],
    ['cumulativePerpFunding', i64],
    ['liquidationMarginFreed', u64],
    ['lastActiveSlot', u64],
    ['nextOrderId', u32],
    ['maxMarginRatio', u32],
    ['nextLiquidationId', u16],
    ['subAccountId', u16],
    ['status', u8],
    ['isMarginTradingEnabled', bool],
    ['idle', bool],
    ['openOrders', u8],
    ['hasOpenOrder', bool],
    ['openAuctions', u8],
    ['hasOpenAuction', bool],
    ['padding', uniformFixedSizeArray(u8, 21)],
  ],
  (args) => args as UserAccount
);

export type InsuranceFundStake = {
  buffer: Buffer;
  authority: PublicKey;
  ifShares: BigNumber;
  lastWithdrawRequestShares: BigNumber;
  ifBase: BigNumber;
  lastValidTs: BigNumber;
  lastWithdrawRequestValue: BigNumber;
  lastWithdrawRequestTs: BigNumber;
  costBasis: BigNumber;
  marketIndex: number;
  padding: number[];
};

export const insuranceFundStakeStruct = new BeetStruct<InsuranceFundStake>(
  [
    ['buffer', blob(8)],
    ['authority', publicKey],
    ['ifShares', u128],
    ['lastWithdrawRequestShares', u128],
    ['ifBase', u128],
    ['lastValidTs', i64],
    ['lastWithdrawRequestValue', u64],
    ['lastWithdrawRequestTs', i64],
    ['costBasis', i64],
    ['marketIndex', u16],
    ['padding', uniformFixedSizeArray(u8, 14)],
  ],
  (args) => args as InsuranceFundStake
);

export type AMM = {
  oracle: PublicKey;
  historicalOracleData: HistoricalOracleData;
  baseAssetAmountPerLp: BigNumber;
  quoteAssetAmountPerLp: BigNumber;
  feePool: PoolBalance;
  baseAssetReserve: BigNumber;
  quoteAssetReserve: BigNumber;
  concentrationCoef: BigNumber;
  minBaseAssetReserve: BigNumber;
  maxBaseAssetReserve: BigNumber;
  sqrtK: BigNumber;
  pegMultiplier: BigNumber;
  terminalQuoteAssetReserve: BigNumber;
  baseAssetAmountLong: BigNumber;
  baseAssetAmountShort: BigNumber;
  baseAssetAmountWithAmm: BigNumber;
  baseAssetAmountWithUnsettledLp: BigNumber;
  maxOpenInterest: BigNumber;
  quoteAssetAmount: BigNumber;
  quoteEntryAmountLong: BigNumber;
  quoteEntryAmountShort: BigNumber;
  quoteBreakEvenAmountLong: BigNumber;
  quoteBreakEvenAmountShort: BigNumber;
  userLpShares: BigNumber;
  lastFundingRate: BigNumber;
  lastFundingRateLong: BigNumber;
  lastFundingRateShort: BigNumber;
  last24hAvgFundingRate: BigNumber;
  totalFee: BigNumber;
  totalMmFee: BigNumber;
  totalExchangeFee: BigNumber;
  totalFeeMinusDistributions: BigNumber;
  totalFeeWithdrawn: BigNumber;
  totalLiquidationFee: BigNumber;
  cumulativeFundingRateLong: BigNumber;
  cumulativeFundingRateShort: BigNumber;
  totalSocialLoss: BigNumber;
  askBaseAssetReserve: BigNumber;
  askQuoteAssetReserve: BigNumber;
  bidBaseAssetReserve: BigNumber;
  bidQuoteAssetReserve: BigNumber;
  lastOracleNormalisedPrice: BigNumber;
  lastOracleReservePriceSpreadPct: BigNumber;
  lastBidPriceTwap: BigNumber;
  lastAskPriceTwap: BigNumber;
  lastMarkPriceTwap: BigNumber;
  lastMarkPriceTwap5min: BigNumber;
  lastUpdateSlot: BigNumber;
  lastOracleConfPct: BigNumber;
  netRevenueSinceLastFunding: BigNumber;
  lastFundingRateTs: BigNumber;
  fundingPeriod: BigNumber;
  orderStepSize: BigNumber;
  orderTickSize: BigNumber;
  minOrderSize: BigNumber;
  maxPositionSize: BigNumber;
  volume24h: BigNumber;
  longIntensityVolume: BigNumber;
  shortIntensityVolume: BigNumber;
  lastTradeTs: BigNumber;
  markStd: BigNumber;
  oracleStd: BigNumber;
  lastMarkPriceTwapTs: BigNumber;
  baseSpread: number;
  maxSpread: number;
  longSpread: number;
  shortSpread: number;
  longIntensityCount: number;
  shortIntensityCount: number;
  maxFillReserveFraction: number;
  maxSlippageRatio: number;
  curveUpdateIntensity: number;
  ammJitIntensity: number;
  oracleSource: OracleSource;
  lastOracleValid: boolean;
  targetBaseAssetAmountPerLp: number;
  perLpBase: number;
  padding1: number;
  padding2: number;
  totalFeeEarnedPerLp: BigNumber;
  netUnsettledFundingPnl: BigNumber;
  quoteAssetAmountWithUnsettledLp: BigNumber;
  referencePriceOffset: number;
  padding: number[];
};

export const ammStruct = new BeetStruct<AMM>(
  [
    ['oracle', publicKey],
    ['historicalOracleData', historicalOracleDataStruct],
    ['baseAssetAmountPerLp', i128],
    ['quoteAssetAmountPerLp', i128],
    ['feePool', poolBalanceStruct],
    ['baseAssetReserve', u128],
    ['quoteAssetReserve', u128],
    ['concentrationCoef', u128],
    ['minBaseAssetReserve', u128],
    ['maxBaseAssetReserve', u128],
    ['sqrtK', u128],
    ['pegMultiplier', u128],
    ['terminalQuoteAssetReserve', u128],
    ['baseAssetAmountLong', i128],
    ['baseAssetAmountShort', i128],
    ['baseAssetAmountWithAmm', i128],
    ['baseAssetAmountWithUnsettledLp', i128],
    ['maxOpenInterest', u128],
    ['quoteAssetAmount', i128],
    ['quoteEntryAmountLong', i128],
    ['quoteEntryAmountShort', i128],
    ['quoteBreakEvenAmountLong', i128],
    ['quoteBreakEvenAmountShort', i128],
    ['userLpShares', u128],
    ['lastFundingRate', i64],
    ['lastFundingRateLong', i64],
    ['lastFundingRateShort', i64],
    ['last24hAvgFundingRate', i64],
    ['totalFee', i128],
    ['totalMmFee', i128],
    ['totalExchangeFee', u128],
    ['totalFeeMinusDistributions', i128],
    ['totalFeeWithdrawn', u128],
    ['totalLiquidationFee', u128],
    ['cumulativeFundingRateLong', i128],
    ['cumulativeFundingRateShort', i128],
    ['totalSocialLoss', u128],
    ['askBaseAssetReserve', u128],
    ['askQuoteAssetReserve', u128],
    ['bidBaseAssetReserve', u128],
    ['bidQuoteAssetReserve', u128],
    ['lastOracleNormalisedPrice', i64],
    ['lastOracleReservePriceSpreadPct', i64],
    ['lastBidPriceTwap', u64],
    ['lastAskPriceTwap', u64],
    ['lastMarkPriceTwap', u64],
    ['lastMarkPriceTwap5min', u64],
    ['lastUpdateSlot', u64],
    ['lastOracleConfPct', u64],
    ['netRevenueSinceLastFunding', i64],
    ['lastFundingRateTs', i64],
    ['fundingPeriod', i64],
    ['orderStepSize', u64],
    ['orderTickSize', u64],
    ['minOrderSize', u64],
    ['maxPositionSize', u64],
    ['volume24h', u64],
    ['longIntensityVolume', u64],
    ['shortIntensityVolume', u64],
    ['lastTradeTs', i64],
    ['markStd', u64],
    ['oracleStd', u64],
    ['lastMarkPriceTwapTs', i64],
    ['baseSpread', u32],
    ['maxSpread', u32],
    ['longSpread', u32],
    ['shortSpread', u32],
    ['longIntensityCount', u32],
    ['shortIntensityCount', u32],
    ['maxFillReserveFraction', u16],
    ['maxSlippageRatio', u16],
    ['curveUpdateIntensity', u8],
    ['ammJitIntensity', u8],
    ['oracleSource', u8],
    ['lastOracleValid', bool],
    ['targetBaseAssetAmountPerLp', i32],
    ['perLpBase', i8],
    ['padding1', u8],
    ['padding2', u16],
    ['totalFeeEarnedPerLp', u64],
    ['netUnsettledFundingPnl', i64],
    ['quoteAssetAmountWithUnsettledLp', i64],
    ['referencePriceOffset', i32],
    ['padding', uniformFixedSizeArray(u8, 12)],
  ],
  (args) => args as AMM
);

export type InsuranceClaim = {
  revenueWithdrawSinceLastSettle: BigNumber;
  maxRevenueWithdrawPerPeriod: BigNumber;
  quoteMaxInsurance: BigNumber;
  quoteSettledInsurance: BigNumber;
  lastRevenueWithdrawTs: BigNumber;
};

export const insuranceClaimStruct = new BeetStruct<InsuranceClaim>(
  [
    ['revenueWithdrawSinceLastSettle', i64],
    ['maxRevenueWithdrawPerPeriod', u64],
    ['quoteMaxInsurance', u64],
    ['quoteSettledInsurance', u64],
    ['lastRevenueWithdrawTs', i64],
  ],
  (args) => args as InsuranceClaim
);

export type PerpMarket = {
  buffer: Buffer;
  pubkey: PublicKey;
  amm: AMM;
  pnlPool: PoolBalance;
  name: number[];
  insuranceClaim: InsuranceClaim;
  unrealizedPnlMaxImbalance: BigNumber;
  expiryTs: BigNumber;
  expiryPrice: BigNumber;
  nextFillRecordId: BigNumber;
  nextFundingRateRecordId: BigNumber;
  nextCurveRecordId: BigNumber;
  imfFactor: number;
  unrealizedPnlImfFactor: number;
  liquidatorFee: number;
  ifLiquidationFee: number;
  marginRatioInitial: number;
  marginRatioMaintenance: number;
  unrealizedPnlInitialAssetWeight: number;
  unrealizedPnlMaintenanceAssetWeight: number;
  numberOfUsersWithBase: number;
  numberOfUsers: number;
  marketIndex: number;
  status: MarketStatus;
  contractType: ContractType;
  contractTier: ContractTier;
  pausedOperations: number;
  quoteSpotMarketIndex: number;
  feeAdjustment: number;
  padding: number[];
};

export const perpMarketStruct = new BeetStruct<PerpMarket>(
  [
    ['buffer', blob(8)],
    ['pubkey', publicKey],
    ['amm', ammStruct],
    ['pnlPool', poolBalanceStruct],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['insuranceClaim', insuranceClaimStruct],
    ['unrealizedPnlMaxImbalance', u64],
    ['expiryTs', i64],
    ['expiryPrice', i64],
    ['nextFillRecordId', u64],
    ['nextFundingRateRecordId', u64],
    ['nextCurveRecordId', u64],
    ['imfFactor', u32],
    ['unrealizedPnlImfFactor', u32],
    ['liquidatorFee', u32],
    ['ifLiquidationFee', u32],
    ['marginRatioInitial', u32],
    ['marginRatioMaintenance', u32],
    ['unrealizedPnlInitialAssetWeight', u32],
    ['unrealizedPnlMaintenanceAssetWeight', u32],
    ['numberOfUsersWithBase', u32],
    ['numberOfUsers', u32],
    ['marketIndex', u16],
    ['status', u8],
    ['contractType', u8],
    ['contractTier', u8],
    ['pausedOperations', u8],
    ['quoteSpotMarketIndex', u16],
    ['feeAdjustment', i16],
    ['padding', uniformFixedSizeArray(u8, 46)],
  ],
  (args) => args as PerpMarket
);

export type PreLaunchOracle = {
  buffer: Buffer;
  price: BigNumber;
  maxPrice: BigNumber;
  confidence: BigNumber;
  lastUpdateSlot: BigNumber;
  ammLastUpdateSlot: BigNumber;
  perpMarketIndex: number;
  padding: number[];
};

export const preLaunchOracleStruct = new BeetStruct<PreLaunchOracle>(
  [
    ['buffer', blob(8)],
    ['price', i64],
    ['maxPrice', i64],
    ['confidence', u64],
    ['lastUpdateSlot', u64],
    ['ammLastUpdateSlot', u64],
    ['perpMarketIndex', u16],
    ['padding', uniformFixedSizeArray(u8, 70)],
  ],
  (args) => args as PreLaunchOracle
);
