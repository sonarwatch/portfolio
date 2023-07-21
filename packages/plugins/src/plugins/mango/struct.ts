import {
  BeetStruct,
  FixableBeetStruct,
  array,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, f32, f64, i64, i80f48, u128, u64 } from '../../utils/solana';

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
