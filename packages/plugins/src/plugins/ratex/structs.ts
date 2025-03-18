import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  bool,
  FixableBeetStruct,
  i32,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { i64, u128, u64 } from '../../utils/solana';

export type State = {
  accountDiscriminator: number[];
  admin: PublicKey;
  signer: PublicKey;
  numberOfAuthorities: BigNumber;
  numberOfSubAccounts: BigNumber;
  collateralRatioInitial: BigNumber;
  collateralRatioMaintenance: BigNumber;
  collateralRatioInitialPreExpiry: BigNumber;
  numberOfYieldMarkets: number;
  numberOfMarginMarkets: number;
  signerNonce: number;
  twapDuration: number;
  marginIndexStart: number;
  marketIndexStart: number;
  keepers: PublicKey[];
  keeperFeePerTx: BigNumber[];
  keeperFee: BigNumber[];
};

export const stateStruct = new FixableBeetStruct<State>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['admin', publicKey],
    ['signer', publicKey],
    ['numberOfAuthorities', u64],
    ['numberOfSubAccounts', u64],
    ['collateralRatioInitial', i64],
    ['collateralRatioMaintenance', i64],
    ['collateralRatioInitialPreExpiry', i64],
    ['numberOfYieldMarkets', u32],
    ['numberOfMarginMarkets', u32],
    ['signerNonce', u8],
    ['twapDuration', u32],
    ['marginIndexStart', u32],
    ['marketIndexStart', u32],
    ['keepers', uniformFixedSizeArray(publicKey, 20)],
    ['keeperFeePerTx', u64],
    ['keeperFee', u64],
  ],
  (args) => args as State
);

export type MarginMarket = {
  accountDiscriminator: number[];
  pubkey: PublicKey;
  mint: PublicKey;
};

export const marginMarketStruct = new FixableBeetStruct<MarginMarket>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['pubkey', publicKey],
    ['mint', publicKey],
  ],
  (args) => args as MarginMarket
);

export type AmmpoolRewardInfo = {
  mint: PublicKey;
  vault: PublicKey;
  authority: PublicKey;
  emissionsPerSecondX64: BigNumber;
  growthGlobalX64: BigNumber;
};

export const ammPoolRewardInfoStruct = new BeetStruct<AmmpoolRewardInfo>(
  [
    ['mint', publicKey],
    ['vault', publicKey],
    ['authority', publicKey],
    ['emissionsPerSecondX64', u128],
    ['growthGlobalX64', u128],
  ],
  (args) => args as AmmpoolRewardInfo
);

export type Ammpool = {
  ammpoolsConfig: PublicKey;
  liquidity: BigNumber;
  sqrtPrice: BigNumber;
  protocolFeeOwedA: BigNumber;
  protocolFeeOwedB: BigNumber;
  tokenMintBase: PublicKey;
  tokenVaultBase: PublicKey;
  feeGrowthGlobalA: BigNumber;
  tokenMintQuote: PublicKey;
  tokenVaultQuote: PublicKey;
  feeGrowthGlobalB: BigNumber;
  rewardLastUpdatedTimestamp: BigNumber;
  rewardInfos: AmmpoolRewardInfo[];
  oracle: PublicKey;
  tickCurrentIndex: number;
  observationIndex: number;
  observationUpdateDuration: number;
  tickSpacing: number;
  tickSpacingSeed: number[];
  feeRate: number;
  protocolFeeRate: number;
};

export const ammpoolStruct = new BeetStruct<Ammpool>(
  [
    ['ammpoolsConfig', publicKey],
    ['liquidity', u128],
    ['sqrtPrice', u128],
    ['protocolFeeOwedA', u64],
    ['protocolFeeOwedB', u64],
    ['tokenMintBase', publicKey],
    ['tokenVaultBase', publicKey],
    ['feeGrowthGlobalA', u128],
    ['tokenMintQuote', publicKey],
    ['tokenVaultQuote', publicKey],
    ['feeGrowthGlobalB', u128],
    ['rewardLastUpdatedTimestamp', u64],
    ['rewardInfos', uniformFixedSizeArray(ammPoolRewardInfoStruct, 3)],
    ['oracle', publicKey],
    ['tickCurrentIndex', i32],
    ['observationIndex', u16],
    ['observationUpdateDuration', u16],
    ['tickSpacing', u16],
    ['tickSpacingSeed', uniformFixedSizeArray(u8, 2)],
    ['feeRate', u16],
    ['protocolFeeRate', u16],
  ],
  (args) => args as Ammpool
);

export enum MarginType {
  NonYieldBearing,
  YieldBearing,
}

export type YieldMarket = {
  accountDiscriminator: number[];
  pubkey: PublicKey;
  oracle: PublicKey;
  name: number[];
  quoteAssetVault: PublicKey;
  baseAssetVault: PublicKey;
  pool: Ammpool;
  startTs: BigNumber;
  expireTs: BigNumber;
  orderStepSize: BigNumber;
  minOrderSize: BigNumber;
  minLpAmount: BigNumber;
  minLiquidationSize: BigNumber;
  marketIndex: number;
  marginIndex: number;
  lpMarginIndex: number;
  marginType: MarginType;
  lpMarginType: MarginType;
  marginDecimals: number;
  lpMarginDecimals: number;
};

export const yieldMarketStruct = new FixableBeetStruct<YieldMarket>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['pubkey', publicKey],
    ['oracle', publicKey],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['quoteAssetVault', publicKey],
    ['baseAssetVault', publicKey],
    ['pool', ammpoolStruct],
    ['startTs', i64],
    ['expireTs', i64],
    ['orderStepSize', u64],
    ['minOrderSize', u64],
    ['minLpAmount', u64],
    ['minLiquidationSize', u64],
    ['marketIndex', u32],
    ['marginIndex', u32],
    ['lpMarginIndex', u32],
    ['marginType', u8],
    ['lpMarginType', u8],
    ['marginDecimals', u8],
    ['lpMarginDecimals', u8],
  ],
  (args) => args as YieldMarket
);

export type Oracle = {
  accountDiscriminator: number[];
  admin: PublicKey;
  name: number[];
  lastRate: BigNumber;
  rate: BigNumber;
  marketRate: BigNumber;
  ts: BigNumber;
  decimals: number;
  padding: number[];
  epochStartTimestamp: BigNumber;
  lastEpochStartTimestamp: BigNumber;
  padding1: number[];
};

export const oracleStruct = new FixableBeetStruct<Oracle>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['admin', publicKey],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['lastRate', u64],
    ['rate', u64],
    ['marketRate', u64],
    ['ts', i64],
    ['decimals', u32],
    ['padding', uniformFixedSizeArray(u8, 4)],
    ['epochStartTimestamp', i64],
    ['lastEpochStartTimestamp', i64],
    ['padding1', uniformFixedSizeArray(u8, 32)],
  ],
  (args) => args as Oracle
);

export type YieldPosition = {
  baseAssetAmount: BigNumber;
  quoteAssetAmount: BigNumber;
  lastRate: BigNumber;
  marketIndex: number;
  padding1: number[];
  padding2: number[];
};

export const yieldPositionStruct = new BeetStruct<YieldPosition>(
  [
    ['baseAssetAmount', i64],
    ['quoteAssetAmount', i64],
    ['lastRate', u64],
    ['marketIndex', u32],
    ['padding1', uniformFixedSizeArray(u8, 4)],
    ['padding2', uniformFixedSizeArray(u8, 32)],
  ],
  (args) => args as YieldPosition
);

export enum OrderStatus {
  Init = 0,
  Open = 1,
  Filled = 2,
  Canceled = 3,
}

export enum OrderType {
  Market = 0,
  Limit = 1,
}

export type Order = {
  slot: BigNumber;
  priceLimit: BigNumber;
  baseAssetAmount: BigNumber;
  baseAssetAmountFilled: BigNumber;
  quoteAssetAmountFilled: BigNumber;
  expireTs: BigNumber;
  orderIndex: number;
  orderId: number;
  isolatedMarginAmount: BigNumber;
  marketIndex: number;
  status: OrderStatus;
  orderType: OrderType;
  isClose: boolean;
  padding1: number[];
  padding2: number[];
};

export const orderStruct = new BeetStruct<Order>(
  [
    ['slot', u64],
    ['priceLimit', u128],
    ['baseAssetAmount', i64],
    ['baseAssetAmountFilled', i64],
    ['quoteAssetAmountFilled', i64],
    ['expireTs', i64],
    ['orderIndex', u32],
    ['orderId', u32],
    ['isolatedMarginAmount', u64],
    ['marketIndex', u32],
    ['status', u8],
    ['orderType', u8],
    ['isClose', bool],
    ['padding1', uniformFixedSizeArray(u8, 1)],
    ['padding2', uniformFixedSizeArray(u8, 32)],
  ],
  (args) => args as Order
);

export type MarginPosition = {
  balance: BigNumber;
  marketIndex: number;
  decimals: number;
  padding2: number[];
};

export const marginPositionStruct = new BeetStruct<MarginPosition>(
  [
    ['balance', i64],
    ['marketIndex', u32],
    ['decimals', u32],
    ['padding2', uniformFixedSizeArray(u8, 32)],
  ],
  (args) => args as MarginPosition
);

export type User = {
  accountDiscriminator: number[];
  authority: PublicKey;
  marginPositions: MarginPosition[];
  orders: Order[];
  yieldPositions: YieldPosition[];
  lastActiveSlot: BigNumber;
  lastOrderId: number;
  subAccountId: number;
  idle: boolean;
  padding2: boolean;
  isIsolated: boolean;
  isExpiryOn: boolean;
  padding1: number[];
};

export const userStruct = new FixableBeetStruct<User>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['authority', publicKey],
    ['marginPositions', uniformFixedSizeArray(marginPositionStruct, 2)],
    ['orders', uniformFixedSizeArray(orderStruct, 32)],
    ['yieldPositions', uniformFixedSizeArray(yieldPositionStruct, 8)],
    ['lastActiveSlot', u64],
    ['lastOrderId', u32],
    ['subAccountId', u16],
    ['idle', bool],
    ['padding2', bool],
    ['isIsolated', bool],
    ['isExpiryOn', bool],
    ['padding1', uniformFixedSizeArray(u8, 6)],
  ],
  (args) => args as User
);

export type UserStats = {
  accountDiscriminator: number[];
  authority: PublicKey;
  referrer: PublicKey;
  numberOfSubAccounts: number;
  numberOfSubAccountsCreated: number;
  padding: number[];
};

export const userStatsStruct = new BeetStruct<UserStats>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['authority', publicKey],
    ['referrer', publicKey],
    ['numberOfSubAccounts', u16],
    ['numberOfSubAccountsCreated', u16],
    ['padding', uniformFixedSizeArray(u8, 52)],
  ],
  (args) => args as UserStats
);

export type PositionRewardInfo = {
  growthInsideCheckpoint: BigNumber;
  amountOwed: BigNumber;
};

export const positionrewardinfoStruct = new BeetStruct<PositionRewardInfo>(
  [
    ['growthInsideCheckpoint', u128],
    ['amountOwed', u64],
  ],
  (args) => args as PositionRewardInfo
);

export type AmmPosition = {
  ammpool: PublicKey;
  liquidity: BigNumber;
  tickLowerIndex: number;
  tickUpperIndex: number;
  lowerRate: BigNumber;
  upperRate: BigNumber;
  feeGrowthCheckpointA: BigNumber;
  feeOwedA: BigNumber;
  feeGrowthCheckpointB: BigNumber;
  feeOwedB: BigNumber;
  rewardInfos: PositionRewardInfo[];
};

export const positionStruct = new BeetStruct<AmmPosition>(
  [
    ['ammpool', publicKey],
    ['liquidity', u128],
    ['tickLowerIndex', i32],
    ['tickUpperIndex', i32],
    ['lowerRate', u64],
    ['upperRate', u64],
    ['feeGrowthCheckpointA', u128],
    ['feeOwedA', u64],
    ['feeGrowthCheckpointB', u128],
    ['feeOwedB', u64],
    ['rewardInfos', uniformFixedSizeArray(positionrewardinfoStruct, 3)],
  ],
  (args) => args as AmmPosition
);

export enum LpStatus {
  Active = 0,
  Updating = 1,
}

export type LP = {
  accountDiscriminator: number[];
  authority: PublicKey;
  ammPosition: AmmPosition;
  reserveQuoteAmount: BigNumber;
  reserveBaseAmount: BigNumber;
  lastActiveSlot: BigNumber;
  subAccountId: BigNumber;
  idle: boolean;
  state: LpStatus;
  padding1: number[];
  padding2: number[];
};

export const lpStruct = new BeetStruct<LP>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['authority', publicKey],
    ['ammPosition', positionStruct],
    ['reserveQuoteAmount', i64],
    ['reserveBaseAmount', i64],
    ['lastActiveSlot', u64],
    ['subAccountId', u16],
    ['idle', bool],
    ['state', u8],
    ['padding1', uniformFixedSizeArray(u8, 7)],
    ['padding2', uniformFixedSizeArray(u8, 72)],
  ],
  (args) => args as LP
);
