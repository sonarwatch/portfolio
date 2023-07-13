import {
  BeetStruct,
  FixableBeetStruct,
  bool,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@metaplex-foundation/js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u128, u64 } from '../../utils/solana';

export type AccountFlag = {
  initialized: boolean;
  market: boolean;
  openOrders: boolean;
  requestQueue: boolean;
  eventQueue: boolean;
  bids: boolean;
  asks: boolean;
};
export const accountFlagStruct = new BeetStruct<AccountFlag>(
  [
    ['initialized', bool],
    ['market', bool],
    ['openOrders', bool],
    ['requestQueue', bool],
    ['eventQueue', bool],
    ['bids', bool],
    ['asks', bool],
  ],
  (args) => args as AccountFlag
);

// Serum Open Order might need to be move

export type OpenOrdersV1 = {
  buffer: Buffer;

  accountFlags: AccountFlag;

  market: PublicKey;
  owner: PublicKey;

  baseTokenFree: BigNumber;
  baseTokenTotal: BigNumber;
  quoteTokenFree: BigNumber;
  quoteTokenTotal: BigNumber;

  freeSlotBits: BigNumber;
  isBidBits: BigNumber;

  orders: BigNumber[];
  clientIds: BigNumber[];

  buffer2: Buffer;
};
export const openOrdersV1Struct = new BeetStruct<OpenOrdersV1>(
  [
    ['buffer', blob(5)],

    ['accountFlags', accountFlagStruct],

    ['market', publicKey],
    ['owner', publicKey],

    ['baseTokenFree', u64],
    ['baseTokenTotal', u64],
    ['quoteTokenFree', u64],
    ['quoteTokenTotal', u64],

    ['freeSlotBits', u128],
    ['isBidBits', u128],

    ['orders', uniformFixedSizeArray(u128, 128)],
    ['clientIds', uniformFixedSizeArray(u64, 128)],

    ['buffer2', blob(7)],
  ],
  (args) => args as OpenOrdersV1
);

// V2 is the same Layout but an additional field : referrerRebatesAccrued
export type OpenOrdersV2 = {
  buffer: Buffer;

  accountFlags: AccountFlag;

  market: PublicKey;
  owner: PublicKey;

  baseTokenFree: BigNumber;
  baseTokenTotal: BigNumber;
  quoteTokenFree: BigNumber;
  quoteTokenTotal: BigNumber;

  freeSlotBits: BigNumber;
  isBidBits: BigNumber;

  orders: BigNumber[];
  clientIds: BigNumber[];
  referrerRebatesAccrued: BigNumber;
  buffer2: Buffer;
};
export const openOrdersV2Struct = new BeetStruct<OpenOrdersV2>(
  [
    ['buffer', blob(6)],

    ['accountFlags', accountFlagStruct],

    ['market', publicKey],
    ['owner', publicKey],

    ['baseTokenFree', u64],
    ['baseTokenTotal', u64],
    ['quoteTokenFree', u64],
    ['quoteTokenTotal', u64],

    ['freeSlotBits', u128],
    ['isBidBits', u128],

    ['orders', uniformFixedSizeArray(u128, 128)],
    ['clientIds', uniformFixedSizeArray(u64, 128)],

    ['referrerRebatesAccrued', u64],

    ['buffer2', blob(7)],
  ],
  (args) => args as OpenOrdersV2
);

export type AmmInfoV4 = {
  status: BigNumber;
  nonce: BigNumber;
  orderNum: BigNumber;
  depth: BigNumber;
  coinDecimals: BigNumber;
  pcDecimals: BigNumber;
  state: BigNumber;
  resetFlag: BigNumber;
  minSize: BigNumber;
  volMaxCutRatio: BigNumber;
  amountWaveRatio: BigNumber;
  coinLotSize: BigNumber;
  pcLotSize: BigNumber;
  minPriceMultiplier: BigNumber;
  maxPriceMultiplier: BigNumber;
  systemDecimalsValue: BigNumber;
  // Fees
  minSeparateNumerator: BigNumber;
  minSeparateDenominator: BigNumber;
  tradeFeeNumerator: BigNumber;
  tradeFeeDenominator: BigNumber;
  pnlNumerator: BigNumber;
  pnlDenominator: BigNumber;
  swapFeeNumerator: BigNumber;
  swapFeeDenominator: BigNumber;
  // OutPutData
  needTakePnlCoin: BigNumber;
  needTakePnlPc: BigNumber;
  totalPnlPc: BigNumber;
  totalPnlCoin: BigNumber;
  poolTotalDepositPc: BigNumber;
  poolTotalDepositCoin: BigNumber;
  swapCoinInAmount: BigNumber;
  swapPcOutAmount: BigNumber;
  swapCoin2PcFee: BigNumber;
  swapPcInAmount: BigNumber;
  swapCoinOutAmount: BigNumber;
  swapPc2CoinFee: BigNumber;

  poolCoinTokenAccount: PublicKey;
  poolPcTokenAccount: PublicKey;
  coinMintAddress: PublicKey;
  pcMintAddress: PublicKey;
  lpMintAddress: PublicKey;
  ammOpenOrders: PublicKey;
  serumMarket: PublicKey;
  serumProgramId: PublicKey;
  ammTargetOrders: PublicKey;
  poolWithdrawQueue: PublicKey;
  poolTempLpTokenAccount: PublicKey;
  ammOwner: PublicKey;
  pnlOwner: PublicKey;
};

export const ammInfoV4Struct = new BeetStruct<AmmInfoV4>(
  [
    ['status', u64],
    ['nonce', u64],
    ['orderNum', u64],
    ['depth', u64],
    ['coinDecimals', u64],
    ['pcDecimals', u64],
    ['state', u64],
    ['resetFlag', u64],
    ['minSize', u64],
    ['volMaxCutRatio', u64],
    ['amountWaveRatio', u64],
    ['coinLotSize', u64],
    ['pcLotSize', u64],
    ['minPriceMultiplier', u64],
    ['maxPriceMultiplier', u64],
    ['systemDecimalsValue', u64],
    // Fees
    ['minSeparateNumerator', u64],
    ['minSeparateDenominator', u64],
    ['tradeFeeNumerator', u64],
    ['tradeFeeDenominator', u64],
    ['pnlNumerator', u64],
    ['pnlDenominator', u64],
    ['swapFeeNumerator', u64],
    ['swapFeeDenominator', u64],
    // OutPutData
    ['needTakePnlCoin', u64],
    ['needTakePnlPc', u64],
    ['totalPnlPc', u64],
    ['totalPnlCoin', u64],
    ['poolTotalDepositPc', u128],
    ['poolTotalDepositCoin', u128],
    ['swapCoinInAmount', u128],
    ['swapPcOutAmount', u128],
    ['swapCoin2PcFee', u64],
    ['swapPcInAmount', u128],
    ['swapCoinOutAmount', u128],
    ['swapPc2CoinFee', u64],

    ['poolCoinTokenAccount', publicKey],
    ['poolPcTokenAccount', publicKey],
    ['coinMintAddress', publicKey],
    ['pcMintAddress', publicKey],
    ['lpMintAddress', publicKey],
    ['ammOpenOrders', publicKey],
    ['serumMarket', publicKey],
    ['serumProgramId', publicKey],
    ['ammTargetOrders', publicKey],
    ['poolWithdrawQueue', publicKey],
    ['poolTempLpTokenAccount', publicKey],
    ['ammOwner', publicKey],
    ['pnlOwner', publicKey],
  ],
  (args) => args as AmmInfoV4
);
export type AmmInfoV5 = {
  accountType: BigNumber;
  status: BigNumber;
  nonce: BigNumber;
  orderNum: BigNumber;
  depth: BigNumber;
  coinDecimals: BigNumber;
  pcDecimals: BigNumber;
  state: BigNumber;
  resetFlag: BigNumber;
  minSize: BigNumber;
  volMaxCutRatio: BigNumber;
  amountWaveRatio: BigNumber;
  coinLotSize: BigNumber;
  pcLotSize: BigNumber;
  minPriceMultiplier: BigNumber;
  maxPriceMultiplier: BigNumber;
  systemDecimalsValue: BigNumber;
  abortTradeFactor: BigNumber;
  priceTickMultiplier: BigNumber;
  priceTick: BigNumber;
  // Fees
  minSeparateNumerator: BigNumber;
  minSeparateDenominator: BigNumber;
  tradeFeeNumerator: BigNumber;
  tradeFeeDenominator: BigNumber;
  pnlNumerator: BigNumber;
  pnlDenominator: BigNumber;
  swapFeeNumerator: BigNumber;
  swapFeeDenominator: BigNumber;
  // OutPutData
  needTakePnlCoin: BigNumber;
  needTakePnlPc: BigNumber;
  totalPnlPc: BigNumber;
  totalPnlCoin: BigNumber;
  poolOpenTime: BigNumber;
  punishPcAmount: BigNumber;
  punishCoinAmount: BigNumber;
  orderbookToInitTime: BigNumber;
  swapCoinInAmount: BigNumber;
  swapPcOutAmount: BigNumber;
  swapPcInAmount: BigNumber;
  swapCoinOutAmount: BigNumber;
  swapCoin2PcFee: BigNumber;
  swapPc2CoinFee: BigNumber;

  poolCoinTokenAccount: PublicKey;
  poolPcTokenAccount: PublicKey;
  coinMintAddress: PublicKey;
  pcMintAddress: PublicKey;
  lpMintAddress: PublicKey;
  modelDataAccount: PublicKey;
  ammOpenOrders: PublicKey;
  serumMarket: PublicKey;
  serumProgramId: PublicKey;
  ammTargetOrders: PublicKey;
  ammOwner: PublicKey;
  padding: BigNumber[];
};

export const ammInfoV5Struct = new BeetStruct<AmmInfoV5>(
  [
    ['accountType', u64],
    ['status', u64],
    ['nonce', u64],
    ['orderNum', u64],
    ['depth', u64],
    ['coinDecimals', u64],
    ['pcDecimals', u64],
    ['state', u64],
    ['resetFlag', u64],
    ['minSize', u64],
    ['volMaxCutRatio', u64],
    ['amountWaveRatio', u64],
    ['coinLotSize', u64],
    ['pcLotSize', u64],
    ['minPriceMultiplier', u64],
    ['maxPriceMultiplier', u64],
    ['systemDecimalsValue', u64],
    ['abortTradeFactor', u64],
    ['priceTickMultiplier', u64],
    ['priceTick', u64],
    // Fees
    ['minSeparateNumerator', u64],
    ['minSeparateDenominator', u64],
    ['tradeFeeNumerator', u64],
    ['tradeFeeDenominator', u64],
    ['pnlNumerator', u64],
    ['pnlDenominator', u64],
    ['swapFeeNumerator', u64],
    ['swapFeeDenominator', u64],
    // OutPutData
    ['needTakePnlCoin', u64],
    ['needTakePnlPc', u64],
    ['totalPnlPc', u64],
    ['totalPnlCoin', u64],
    ['poolOpenTime', u64],
    ['punishPcAmount', u64],
    ['punishCoinAmount', u64],
    ['orderbookToInitTime', u64],
    ['swapCoinInAmount', u128],
    ['swapPcOutAmount', u128],
    ['swapPcInAmount', u128],
    ['swapCoinOutAmount', u128],
    ['swapCoin2PcFee', u64],
    ['swapPc2CoinFee', u64],

    ['poolCoinTokenAccount', publicKey],
    ['poolPcTokenAccount', publicKey],
    ['coinMintAddress', publicKey],
    ['pcMintAddress', publicKey],
    ['lpMintAddress', publicKey],
    ['modelDataAccount', publicKey],
    ['ammOpenOrders', publicKey],
    ['serumMarket', publicKey],
    ['serumProgramId', publicKey],
    ['ammTargetOrders', publicKey],
    ['ammOwner', publicKey],
    ['padding', uniformFixedSizeArray(u64, 64)],
  ],
  (args) => args as AmmInfoV5
);

export type UserFarmInfoV5 = {
  state: BigNumber;
  poolId: PublicKey;
  stakerOwner: PublicKey;
  depositBalance: BigNumber;
  rewardDebt: BigNumber;
  rewardDebtB: BigNumber;
  padding: BigNumber[];
};

export const userFarmInfoV5Struct = new FixableBeetStruct<UserFarmInfoV5>(
  [
    ['state', u64],
    ['poolId', publicKey],
    ['stakerOwner', publicKey],
    ['depositBalance', u64],
    ['rewardDebt', u128],
    ['rewardDebtB', u128],
    ['padding', uniformFixedSizeArray(u64, 17)],
  ],
  (args) => args as UserFarmInfoV5
);
