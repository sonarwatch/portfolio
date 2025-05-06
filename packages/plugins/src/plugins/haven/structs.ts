import {
  BeetStruct,
  bool,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u64 } from '../../utils/solana';

export enum PositionType {
  Leverage,
  SafeLoan,
}
export enum LendingPlatform {
  Marginfi,
}

export type SolautoSettingsParameters = {
  boostToBps: number;
  boostGap: number;
  repayToBps: number;
  repayGap: number;
  padding: number[];
};
const solautoSettingsParametersStruct =
  new BeetStruct<SolautoSettingsParameters>(
    [
      ['boostToBps', u16],
      ['boostGap', u16],
      ['repayToBps', u16],
      ['repayGap', u16],
      ['padding', uniformFixedSizeArray(u32, 24)],
    ],
    (args) => args as SolautoSettingsParameters,
    'SolautoSettingsParameters'
  );

export type TokenAmount = {
  baseUnit: BigNumber;
  baseAmountUsdValue: BigNumber;
};
const tokenAmountStruct = new BeetStruct<TokenAmount>(
  [
    ['baseUnit', u64],
    ['baseAmountUsdValue', u64],
  ],
  (args) => args as TokenAmount,
  'TokenAmount'
);

export type PositionTokenState = {
  mint: PublicKey;
  decimals: number;
  padding1: number[];
  borrowFeeBps: number;
  amountUsed: TokenAmount;
  amountCanBeUsed: TokenAmount;
  baseAmountMarketPriceUsd: BigNumber;
  padding2: number[];
  padding: number[];
};
const positionTokenStateStruct = new BeetStruct<PositionTokenState>(
  [
    ['mint', publicKey],
    ['decimals', u8],
    ['padding1', uniformFixedSizeArray(u8, 5)],
    ['borrowFeeBps', u16],
    ['amountUsed', tokenAmountStruct],
    ['amountCanBeUsed', tokenAmountStruct],
    ['baseAmountMarketPriceUsd', u64],
    ['padding2', uniformFixedSizeArray(u8, 8)],
    ['padding', uniformFixedSizeArray(u8, 32)],
  ],
  (args) => args as PositionTokenState,
  'PositionTokenState'
);

export type PositionData = {
  lendingPlatform: LendingPlatform;
  padding1: number[];
  lpUserAccount: PublicKey;
  lpSupplyAccount: PublicKey;
  lpDebtAccount: PublicKey;
  settings: SolautoSettingsParameters;
  lpPoolAccount: number;
  padding: number[];
};
const positionDataStruct = new BeetStruct<PositionData>(
  [
    ['lendingPlatform', u8],
    ['padding1', uniformFixedSizeArray(u8, 7)],
    ['lpUserAccount', publicKey],
    ['lpSupplyAccount', publicKey],
    ['lpDebtAccount', publicKey],
    ['settings', solautoSettingsParametersStruct],
    ['lpPoolAccount', publicKey],
    ['padding', uniformFixedSizeArray(u32, 20)],
  ],
  (args) => args as PositionData,
  'PositionData'
);

export type PositionState = {
  liqUtilizationRateBps: number;
  padding1: number[];
  netWorth: TokenAmount;
  supply: PositionTokenState;
  debt: PositionTokenState;
  maxLtvBps: number;
  liqThresholdBps: number;
  padding2: number[];
  lastRefreshed: BigNumber;
  padding: number[];
};
const positionStateStruct = new BeetStruct<PositionState>(
  [
    ['liqUtilizationRateBps', u16],
    ['padding1', uniformFixedSizeArray(u8, 6)],
    ['netWorth', tokenAmountStruct],
    ['supply', positionTokenStateStruct],
    ['debt', positionTokenStateStruct],
    ['maxLtvBps', u16],
    ['liqThresholdBps', u16],
    ['padding2', uniformFixedSizeArray(u8, 4)],
    ['lastRefreshed', u64],
    ['padding', uniformFixedSizeArray(u32, 2)],
  ],
  (args) => args as PositionState,
  'PositionState'
);

export type Position = {
  bump: number[];
  positionId: number[];
  selfManaged: boolean;
  positionType: PositionType;
  padding1: number[];
  authority: PublicKey;
  position: PositionData;
  state: PositionState;
};
export const positionStruct = new BeetStruct<Position>(
  [
    ['bump', uniformFixedSizeArray(u8, 1)],
    ['positionId', uniformFixedSizeArray(u8, 1)],
    ['selfManaged', bool],
    ['positionType', u8],
    ['padding1', uniformFixedSizeArray(u8, 4)],
    ['authority', publicKey],
    ['position', positionDataStruct],
    ['state', positionStateStruct],
  ],
  (args) => args as Position,
  'Position'
);
