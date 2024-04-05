import {
  BeetStruct,
  FixableBeetStruct,
  array,
  bool,
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
  f32,
  f64,
  i128,
  i64,
  i80f48,
  u128,
  u64,
} from '../../utils/solana';

// https://github.com/blockworks-foundation/mango-v4/blob/0f10cb4d925c78f8548da53e1ba518d4df521004/mango_v4.json

const MAX_TOKENS = 16;
const MAX_PAIRS = MAX_TOKENS - 1;
const MAX_NODE_BANKS = 8;

export type StablePriceModel = {
  stablePrice: BigNumber;
  lastUpdateTimestamp: BigNumber;
  delayPrices: BigNumber[];
  delayAccumulatorPrice: BigNumber;
  delayAccumulatorTime: BigNumber;
  delayIntervalSeconds: BigNumber;
  delayGrowthLimit: BigNumber;
  stableGrowthLimit: BigNumber;
  lastDelayIntervalIndex: number;
  padding: number[];
  reserved: number[];
};

export const stablePriceModelStruct = new FixableBeetStruct<StablePriceModel>(
  [
    ['stablePrice', f64],
    ['lastUpdateTimestamp', u64],
    ['delayPrices', uniformFixedSizeArray(f64, 24)],
    ['delayAccumulatorPrice', f64],
    ['delayAccumulatorTime', u32],
    ['delayIntervalSeconds', u32],
    ['delayGrowthLimit', f32],
    ['stableGrowthLimit', f32],
    ['lastDelayIntervalIndex', u8],
    ['padding', uniformFixedSizeArray(u8, 7)],
    ['reserved', uniformFixedSizeArray(u8, 48)],
  ],
  (args) => args as StablePriceModel
);

export type OracleConfig = {
  confFilter: BigNumber;
  maxStalenessSlots: BigNumber;
  reserved: number[];
};

export const oracleConfigStruct = new BeetStruct<OracleConfig>(
  [
    ['confFilter', i80f48],
    ['maxStalenessSlots', i64],
    ['reserved', uniformFixedSizeArray(u8, 72)],
  ],
  (args) => args as OracleConfig
);

export type Bank = {
  buffer: Buffer;
  group: PublicKey;
  name: number[];
  mint: PublicKey;
  vault: PublicKey;
  oracle: PublicKey;
  oracleConfig: OracleConfig;
  stablePriceModel: StablePriceModel;
  depositIndex: BigNumber;
  borrowIndex: BigNumber;
  indexedDeposits: BigNumber;
  indexedBorrows: BigNumber;
  indexLastUpdated: BigNumber;
  bankRateLastUpdated: BigNumber;
  avgUtilization: BigNumber;
  adjustmentFactor: BigNumber;
  util0: BigNumber;
  rate0: BigNumber;
  util1: BigNumber;
  rate1: BigNumber;
  maxRate: BigNumber;
  collectedFeesNative: BigNumber;
  loanOriginationFeeRate: BigNumber;
  loanFeeRate: BigNumber;
  maintAssetWeight: BigNumber;
  initAssetWeight: BigNumber;
  maintLiabWeight: BigNumber;
  initLiabWeight: BigNumber;
  liquidationFee: BigNumber;
  dust: BigNumber;
  flashLoanTokenAccountInitial: BigNumber;
  flashLoanApprovedAmount: BigNumber;
  tokenIndex: number;
  bump: number;
  mintDecimals: number;
  bankNum: number;
  minVaultToDepositsRatio: BigNumber;
  netBorrowLimitWindowSizeTs: BigNumber;
  lastNetBorrowsWindowStartTs: BigNumber;
  netBorrowLimitPerWindowQuote: BigNumber;
  netBorrowsInWindow: BigNumber;
  borrowWeightScaleStartQuote: BigNumber;
  depositWeightScaleStartQuote: BigNumber;
  reduceOnly: number;
  forceClose: number;
  reserved: number[];
};

export const bankStruct = new FixableBeetStruct<Bank>(
  [
    ['buffer', blob(8)],
    ['group', publicKey],
    ['name', uniformFixedSizeArray(u8, 16)],
    ['mint', publicKey],
    ['vault', publicKey],
    ['oracle', publicKey],
    ['oracleConfig', oracleConfigStruct],
    ['stablePriceModel', stablePriceModelStruct],
    ['depositIndex', i80f48],
    ['borrowIndex', i80f48],
    ['indexedDeposits', i80f48],
    ['indexedBorrows', i80f48],
    ['indexLastUpdated', u64],
    ['bankRateLastUpdated', u64],
    ['avgUtilization', i80f48],
    ['adjustmentFactor', i80f48],
    ['util0', i80f48],
    ['rate0', i80f48],
    ['util1', i80f48],
    ['rate1', i80f48],
    ['maxRate', i80f48],
    ['collectedFeesNative', i80f48],
    ['loanOriginationFeeRate', i80f48],
    ['loanFeeRate', i80f48],
    ['maintAssetWeight', i80f48],
    ['initAssetWeight', i80f48],
    ['maintLiabWeight', i80f48],
    ['initLiabWeight', i80f48],
    ['liquidationFee', i80f48],
    ['dust', i80f48],
    ['flashLoanTokenAccountInitial', u64],
    ['flashLoanApprovedAmount', u64],
    ['tokenIndex', u16],
    ['bump', u8],
    ['mintDecimals', u8],
    ['bankNum', u32],
    ['minVaultToDepositsRatio', f64],
    ['netBorrowLimitWindowSizeTs', u64],
    ['lastNetBorrowsWindowStartTs', u64],
    ['netBorrowLimitPerWindowQuote', i64],
    ['netBorrowsInWindow', i64],
    ['borrowWeightScaleStartQuote', f64],
    ['depositWeightScaleStartQuote', f64],
    ['reduceOnly', u8],
    ['forceClose', u8],
    ['reserved', uniformFixedSizeArray(u8, 2110)],
  ],
  (args) => args as Bank
);

export type TokenPosition = {
  indexedPosition: BigNumber;
  tokenIndex: number;
  inUseCount: number;
  padding: number[];
  previousIndex: BigNumber;
  cumulativeDepositInterest: BigNumber;
  cumulativeBorrowInterest: BigNumber;
  reserved: number[];
};
export const tokenPositionStruct = new BeetStruct<TokenPosition>(
  [
    ['indexedPosition', i80f48],
    ['tokenIndex', u16],
    ['inUseCount', u8],
    ['padding', uniformFixedSizeArray(u8, 5)],
    ['previousIndex', i80f48],
    ['cumulativeDepositInterest', f64],
    ['cumulativeBorrowInterest', f64],
    ['reserved', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as TokenPosition
);

export type Serum3Orders = {
  openOrders: PublicKey;
  baseBorrowsWithoutFee: BigNumber;
  quoteBorrowsWithoutFee: BigNumber;
  marketIndex: number;
  baseTokenIndex: number;
  quoteTokenIndex: number;
  padding: number[];
  reserved: number[];
};
export const serum3OrdersStruct = new BeetStruct<Serum3Orders>(
  [
    ['openOrders', publicKey],
    ['baseBorrowsWithoutFee', u64],
    ['quoteBorrowsWithoutFee', u64],
    ['marketIndex', u16],
    ['baseTokenIndex', u16],
    ['quoteTokenIndex', u16],
    ['padding', uniformFixedSizeArray(u8, 2)],
    ['reserved', uniformFixedSizeArray(u8, 64)],
  ],
  (args) => args as Serum3Orders
);

export type PerpPosition = {
  marketIndex: number;
  padding: number[];
  settlePnlLimitWindow: number;
  settlePnlLimitSettledInCurrentWindowNative: BigNumber;
  basePositionLots: BigNumber;
  quotePositionNative: BigNumber;
  quoteRunningNative: BigNumber;
  longSettledFunding: BigNumber;
  shortSettledFunding: BigNumber;
  bidsBaseLots: BigNumber;
  asksBaseLots: BigNumber;
  takerBaseLots: BigNumber;
  takerQuoteLots: BigNumber;
  cumulativeLongFunding: BigNumber;
  cumulativeShortFunding: BigNumber;
  makerVolume: BigNumber;
  takerVolume: BigNumber;
  perpSpotTransfers: BigNumber;
  avgEntryPricePerBaseLot: BigNumber;
  realizedTradePnlNative: BigNumber;
  realizedOtherPnlNative: BigNumber;
  settlePnlLimitRealizedTrade: BigNumber;
  realizedPnlForPositionNative: BigNumber;
  reserved: number[];
};
export const perpPositionStruct = new BeetStruct<PerpPosition>(
  [
    ['marketIndex', u16],
    ['padding', uniformFixedSizeArray(u8, 2)],
    ['settlePnlLimitWindow', u32],
    ['settlePnlLimitSettledInCurrentWindowNative', i64],
    ['basePositionLots', i64],
    ['quotePositionNative', i80f48],
    ['quoteRunningNative', i64],
    ['longSettledFunding', i80f48],
    ['shortSettledFunding', i80f48],
    ['bidsBaseLots', i64],
    ['asksBaseLots', i64],
    ['takerBaseLots', i64],
    ['takerQuoteLots', i64],
    ['cumulativeLongFunding', f64],
    ['cumulativeShortFunding', f64],
    ['makerVolume', u64],
    ['takerVolume', u64],
    ['perpSpotTransfers', i64],
    ['avgEntryPricePerBaseLot', f64],
    ['realizedTradePnlNative', i80f48],
    ['realizedOtherPnlNative', i80f48],
    ['settlePnlLimitRealizedTrade', i64],
    ['realizedPnlForPositionNative', i80f48],
    ['reserved', uniformFixedSizeArray(u8, 88)],
  ],
  (args) => args as PerpPosition
);

export type PerpOpenOrder = {
  sideAndTree: number;
  padding1: number[];
  market: number;
  padding2: number[];
  clientId: BigNumber;
  id: BigNumber;
  reserved: number[];
};
export const perpOpenOrderStruct = new BeetStruct<PerpOpenOrder>(
  [
    ['sideAndTree', u8],
    ['padding1', uniformFixedSizeArray(u8, 1)],
    ['market', u16],
    ['padding2', uniformFixedSizeArray(u8, 4)],
    ['clientId', u64],
    ['id', u128],
    ['reserved', uniformFixedSizeArray(u8, 64)],
  ],
  (args) => args as PerpOpenOrder
);

export type MangoAccount = {
  buffer: Buffer;
  group: PublicKey;
  owner: PublicKey;
  name: number[];
  delegate: PublicKey;
  accountNum: BigNumber;
  beingLiquidated: number;
  inHealthRegion: number;
  bump: number;
  padding: number[];
  netDeposits: BigNumber;
  perpSpotTransfers: BigNumber;
  healthRegionBeginInitHealth: BigNumber;
  frozenUntil: BigNumber;
  buybackFeesAccruedCurrent: BigNumber;
  buybackFeesAccruedPrevious: BigNumber;
  buybackFeesExpiryTimestamp: BigNumber;
  reserved: number[];
  headerVersion: number;
  padding3: number[];
  padding4: BigNumber;
  tokens: TokenPosition[];
  padding5: BigNumber;
  serum3: Serum3Orders[];
  padding6: BigNumber;
  perps: PerpPosition[];
  padding7: BigNumber;
  perpOpenOrders: PerpOpenOrder[];
};

export const mangoAccountStruct = new FixableBeetStruct<MangoAccount>(
  [
    ['buffer', blob(8)],
    ['group', publicKey],
    ['owner', publicKey],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['delegate', publicKey],
    ['accountNum', u32],
    ['beingLiquidated', u8],
    ['inHealthRegion', u8],
    ['bump', u8],
    ['padding', uniformFixedSizeArray(u8, 1)],
    ['netDeposits', i64],
    ['perpSpotTransfers', i64],
    ['healthRegionBeginInitHealth', i64],
    ['frozenUntil', u64],
    ['buybackFeesAccruedCurrent', u64],
    ['buybackFeesAccruedPrevious', u64],
    ['buybackFeesExpiryTimestamp', u64],
    ['reserved', uniformFixedSizeArray(u8, 208)],
    ['headerVersion', u8],
    ['padding3', uniformFixedSizeArray(u8, 7)],
    ['padding4', u32],
    ['tokens', array(tokenPositionStruct)],
    ['padding5', u32],
    ['serum3', array(serum3OrdersStruct)],
    ['padding6', u32],
    ['perps', array(perpPositionStruct)],
    ['padding7', u32],
    ['perpOpenOrders', array(perpOpenOrderStruct)],
  ],
  (args) => args as MangoAccount
);

export type TokenConditionalSwap = {
  id: BigNumber;
  maxBuy: BigNumber;
  maxSell: BigNumber;
  bought: BigNumber;
  sold: BigNumber;
  expiryTimestamp: BigNumber;
  priceLowerLimit: BigNumber;
  priceUpperLimit: BigNumber;
  pricePremiumRate: BigNumber;
  takerFeeRate: BigNumber;
  makerFeeRate: BigNumber;
  buyTokenIndex: number;
  sellTokenIndex: number;
  isConfigured: number;
  allowCreatingDeposits: number;
  allowCreatingBorrows: number;
  displayPriceStyle: number;
  intention: number;
  tcsType: number;
  padding: number[];
  startTimestamp: BigNumber;
  durationSeconds: BigNumber;
  reserved: number[];
};

export const tokenConditionalSwap = new FixableBeetStruct<TokenConditionalSwap>(
  [
    ['id', u64],
    ['maxBuy', u64],
    ['maxSell', u64],
    ['bought', u64],
    ['sold', u64],
    ['expiryTimestamp', u64],
    ['priceLowerLimit', f64],
    ['priceUpperLimit', f64],
    ['pricePremiumRate', f64],
    ['takerFeeRate', f32],
    ['makerFeeRate', f32],
    ['buyTokenIndex', u16],
    ['sellTokenIndex', u16],
    ['isConfigured', u8],
    ['allowCreatingDeposits', u8],
    ['allowCreatingBorrows', u8],
    ['displayPriceStyle', u8],
    ['intention', u8],
    ['tcsType', u8],
    ['padding', uniformFixedSizeArray(u8, 6)],
    ['startTimestamp', u64],
    ['durationSeconds', u64],
    ['reserved', uniformFixedSizeArray(u8, 88)],
  ],
  (args) => args as TokenConditionalSwap
);

export type BoostAccount = MangoAccount & {
  padding8: number;
  tokenConditionalSwaps: TokenConditionalSwap[];
  reservedDynamic: number[];
};

export const boostAccountStruct = new FixableBeetStruct<BoostAccount>(
  [
    ['buffer', blob(8)],
    ['group', publicKey],
    ['owner', publicKey],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['delegate', publicKey],
    ['accountNum', u32],
    ['beingLiquidated', u8],
    ['inHealthRegion', u8],
    ['bump', u8],
    ['padding', uniformFixedSizeArray(u8, 1)],
    ['netDeposits', i64],
    ['perpSpotTransfers', i64],
    ['healthRegionBeginInitHealth', i64],
    ['frozenUntil', u64],
    ['buybackFeesAccruedCurrent', u64],
    ['buybackFeesAccruedPrevious', u64],
    ['buybackFeesExpiryTimestamp', u64],
    ['reserved', uniformFixedSizeArray(u8, 208)],
    ['headerVersion', u8],
    ['padding3', uniformFixedSizeArray(u8, 7)],
    ['padding4', u32],
    ['tokens', array(tokenPositionStruct)],
    ['padding5', u32],
    ['serum3', array(serum3OrdersStruct)],
    ['padding6', u32],
    ['perps', array(perpPositionStruct)],
    ['padding7', u32],
    ['perpOpenOrders', array(perpOpenOrderStruct)],
    ['padding8', u32],
    ['tokenConditionalSwaps', array(tokenConditionalSwap)],
    ['reservedDynamic', uniformFixedSizeArray(u8, 64)],
  ],
  (args) => args as BoostAccount
);

export type PerpAccount = {
  basePosition: BigNumber;
  quotePosition: BigNumber;
  longSettledFunding: BigNumber;
  shortSettledFunding: BigNumber;
  bidsQuantity: BigNumber;
  asksQuantity: BigNumber;
  takerBase: BigNumber;
  takerQuote: BigNumber;
  mngoAccrued: BigNumber;
};

export const perpAccountStruct = new BeetStruct<PerpAccount>(
  [
    ['basePosition', i64], // i64
    ['quotePosition', i80f48],
    ['longSettledFunding', i80f48],
    ['shortSettledFunding', i80f48],
    ['bidsQuantity', i64], // i64
    ['asksQuantity', i64], // i64
    ['takerBase', i64], // i64
    ['takerQuote', i64], // i64
    ['mngoAccrued', u64], // u64
  ],
  (args) => args as PerpAccount
);

export type MetaData = {
  dataType: number;
  version: number;
  isInitialized: number;
  extraInfo: number[];
};

export const metaDataStruct = new BeetStruct<MetaData>(
  [
    ['dataType', u8],
    ['version', u8],
    ['isInitialized', u8],
    ['extraInfo', uniformFixedSizeArray(u8, 5)],
  ],
  (args) => args as MetaData
);

export enum Side {
  buy,
  sell,
}

export type MangoAccountV3 = {
  // buffer: Buffer;
  metaData: MetaData;
  mangoGroup: PublicKey;
  owner: PublicKey;

  inMarginBasket: boolean[]; // 15
  numInMarginBasket: number; // u8
  deposits: BigNumber[]; // 16
  borrows: BigNumber[]; // 16

  spotOpenOrders: PublicKey[]; // 15
  perpAccounts: PerpAccount[]; // 15

  orderMarket: number[]; // 64 * u8
  orderSide: Side[]; // 64 * bool
  orders: BigNumber[]; // i128 * 64
  clientOrderIds: BigNumber[]; // u64 * 64

  msrmAmount: BigNumber; // u64

  beingLiquidated: boolean;
  isBankrupt: boolean;
  info: number[]; // u8 * 32

  advancedOrdersKey: PublicKey;

  notUpgradable: boolean;
  delegate: PublicKey;
};

export const mangoAccountV3Struct = new BeetStruct<MangoAccountV3>(
  [
    // ['buffer', blob(8)],
    ['metaData', metaDataStruct],
    ['mangoGroup', publicKey],
    ['owner', publicKey],

    ['inMarginBasket', uniformFixedSizeArray(bool, MAX_PAIRS)],
    ['numInMarginBasket', u8],
    ['deposits', uniformFixedSizeArray(i80f48, MAX_TOKENS)],
    ['borrows', uniformFixedSizeArray(i80f48, MAX_TOKENS)],

    ['spotOpenOrders', uniformFixedSizeArray(publicKey, MAX_PAIRS)],
    ['perpAccounts', uniformFixedSizeArray(perpAccountStruct, MAX_PAIRS)],

    ['orderMarket', uniformFixedSizeArray(u8, 64)],
    ['orderSide', uniformFixedSizeArray(u8, 64)],
    ['orders', uniformFixedSizeArray(i128, 64)],
    ['clientOrderIds', uniformFixedSizeArray(u64, 64)],

    ['msrmAmount', u64],

    ['beingLiquidated', bool],
    ['isBankrupt', bool],
    ['info', uniformFixedSizeArray(u8, 32)],

    ['advancedOrdersKey', publicKey],

    ['notUpgradable', bool],
    ['delegate', publicKey],
  ],
  (args) => args as MangoAccountV3
);

export type SpotMarketInfo = {
  spotMarket: PublicKey;
  maintAssetWeight: BigNumber;
  initAssetWeight: BigNumber;
  maintLiabWeight: BigNumber;
  initLiabWeight: BigNumber;
  liquidationFee: BigNumber;
};

export const spotMarketInfoStruct = new BeetStruct<SpotMarketInfo>(
  [
    ['spotMarket', publicKey],
    ['maintAssetWeight', i80f48],
    ['initAssetWeight', i80f48],
    ['maintLiabWeight', i80f48],
    ['initLiabWeight', i80f48],
    ['liquidationFee', i80f48],
  ],
  (args) => args as SpotMarketInfo
);

export type PerpMarketInfo = {
  perpMarket: PublicKey;
  maintAssetWeight: BigNumber;
  initAssetWeight: BigNumber;
  maintLiabWeight: BigNumber;
  initLiabWeight: BigNumber;
  liquidationFee: BigNumber;
  makerFee: BigNumber;
  takerFee: BigNumber;
  baseLotSize: BigNumber;
  quoteLotSize: BigNumber;
};
export const perpMarketInfoStruct = new BeetStruct<PerpMarketInfo>(
  [
    ['perpMarket', publicKey],
    ['maintAssetWeight', i80f48],
    ['initAssetWeight', i80f48],
    ['maintLiabWeight', i80f48],
    ['initLiabWeight', i80f48],
    ['liquidationFee', i80f48],
    ['makerFee', i80f48],
    ['takerFee', i80f48],
    ['baseLotSize', i64],
    ['quoteLotSize', i64],
  ],
  (args) => args as PerpMarketInfo
);

export type TokenInfo = {
  mint: PublicKey;
  rootBank: PublicKey;
  decimals: number;
  spotMarketMode: number;
  perpMarketMode: number;
  oracleInactive: boolean;
  padding: number[];
};

export const tokenInfoStruct = new BeetStruct<TokenInfo>(
  [
    ['mint', publicKey],
    ['rootBank', publicKey],
    ['decimals', u8],
    ['spotMarketMode', u8],
    ['perpMarketMode', u8],
    ['oracleInactive', bool],
    ['padding', uniformFixedSizeArray(u8, 4)],
  ],
  (args) => args as TokenInfo
);

export type MangoGroupV3 = {
  // buffer: Buffer;
  metaData: MetaData;
  numOracles: BigNumber; // usize?

  tokens: TokenInfo[];
  spotMarkets: SpotMarketInfo[];
  perpMarkets: PerpMarketInfo[];

  oracles: PublicKey[];

  signerNonce: BigNumber;
  signerKey: PublicKey;
  admin: PublicKey;
  dexProgramId: PublicKey;
  mangoCache: PublicKey;
  validInterval: BigNumber;
  insuranceVault: PublicKey;
  srmVault: PublicKey;
  msrmVault: PublicKey;
  feesVault: PublicKey;

  maxMangoAccounts: BigNumber;
  numMangoAccounts: BigNumber;
  refSurchargeCentibpsTier1: BigNumber;
  refShareCentibpsTier1: BigNumber;
  refMngoRequired: BigNumber;
  refSurchargeCentibpsTier2: number;
  refShareCentibpsTier2: number;
  refMngoTier2Factor: number;
  padding: number[];
};

export const mangoGroupV3Struct = new BeetStruct<MangoGroupV3>(
  [
    // ['buffer', blob(8)],
    ['metaData', metaDataStruct],
    ['numOracles', u64], // usize?

    ['tokens', uniformFixedSizeArray(tokenInfoStruct, MAX_TOKENS)],
    ['spotMarkets', uniformFixedSizeArray(spotMarketInfoStruct, MAX_PAIRS)],
    ['perpMarkets', uniformFixedSizeArray(perpMarketInfoStruct, MAX_PAIRS)],

    ['oracles', uniformFixedSizeArray(publicKey, MAX_PAIRS)],

    ['signerNonce', u64],
    ['signerKey', publicKey],
    ['admin', publicKey],
    ['dexProgramId', publicKey],
    ['mangoCache', publicKey],
    ['validInterval', u64],
    ['insuranceVault', publicKey],
    ['srmVault', publicKey],
    ['msrmVault', publicKey],
    ['feesVault', publicKey],

    ['maxMangoAccounts', u32],
    ['numMangoAccounts', u32],
    ['refSurchargeCentibpsTier1', u32],
    ['refShareCentibpsTier1', u32],
    ['refMngoRequired', u64],
    ['refSurchargeCentibpsTier2', u16],
    ['refShareCentibpsTier2', u16],
    ['refMngoTier2Factor', u8],
    ['padding', uniformFixedSizeArray(u8, 3)],
  ],
  (args) => args as MangoGroupV3
);

export type RootBank = {
  metaData: MetaData;
  optimalUtil: BigNumber;
  optimalRate: BigNumber;
  maxRate: BigNumber;
  numNodeBanks: BigNumber; // usize?
  nodeBanks: PublicKey[];
  depositIndex: BigNumber;
  borrowIndex: BigNumber;
  lastUpdated: BigNumber;
  padding: number[];
};

export const rootBankStruct = new FixableBeetStruct<RootBank>(
  [
    ['metaData', metaDataStruct],
    ['optimalUtil', i80f48],
    ['optimalRate', i80f48],
    ['maxRate', i80f48],
    ['numNodeBanks', u64], // usize?
    ['nodeBanks', uniformFixedSizeArray(publicKey, MAX_NODE_BANKS)],
    ['depositIndex', i80f48],
    ['borrowIndex', i80f48],
    ['lastUpdated', u64],
    ['padding', uniformFixedSizeArray(u8, 64)],
  ],
  (args) => args as RootBank
);
