import { publicKey } from '@metaplex-foundation/beet-solana';
import {
  BeetStruct,
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { blob, u64 } from '../../utils/solana';

export type Fund = {
  buffer: Buffer;
  version: BigNumber;
  manager: PublicKey;
  fundToken: PublicKey;
  managerFee: BigNumber;
  supplyOutstanding: BigNumber;
  activelyManaged: BigNumber;
  activeBuyStates: BigNumber;
  sellState: BigNumber;
  rebalanceSellState: BigNumber;
  hostPubkey: PublicKey;
  hostFee: BigNumber;
  numOfTokens: BigNumber;

  currentCompToken: BigNumber[];
  currentCompAmount: BigNumber[];
  lastRebalanceTime: BigNumber[];
  targetWeight: BigNumber[];
  weightSum: BigNumber;
  currentWeight: BigNumber[];
  fundWorth: BigNumber;
  lastUpdateTime: BigNumber;
  refilterInterval: BigNumber;
  reweightInterval: BigNumber;
  rebalanceInterval: BigNumber;
  rebalanceThreshold: BigNumber;
  rebalanceSlippage: BigNumber;
  lpOffsetThreshold: BigNumber;
  lastRefilterTime: BigNumber;
  lastReweightTime: BigNumber;
  rulesReady: BigNumber;
  assetPool: BigNumber[];
  numOfRules: BigNumber;
  rules: Buffer[];
  numRuleTokens: BigNumber;
  ruleTokens: BigNumber[];
  ruleTokenWeights: BigNumber[];
  messageDigestFive: number[];
  disableRebalance: BigNumber;
  disableLp: BigNumber;
  allowMultiAssetContribution: number;
  symbolLength: number;
  symbol: number[];
  nameLength: number;
  name: number[];
  uriLength: number;
  uri: number[];
  extraBytes: number[];
};

export const fundStruct = new BeetStruct<Fund>(
  [
    ['buffer', blob(8)],
    ['version', u64],
    ['manager', publicKey],
    ['fundToken', publicKey],
    ['managerFee', u64],
    ['supplyOutstanding', u64],
    ['activelyManaged', u64],
    ['activeBuyStates', u64],
    ['sellState', u64],
    ['rebalanceSellState', u64],
    ['hostPubkey', publicKey],
    ['hostFee', u64],
    ['numOfTokens', u64],

    ['currentCompToken', uniformFixedSizeArray(u64, 20)],
    ['currentCompAmount', uniformFixedSizeArray(u64, 20)],
    ['lastRebalanceTime', uniformFixedSizeArray(u64, 20)],
    ['targetWeight', uniformFixedSizeArray(u64, 20)],
    ['weightSum', u64],
    ['currentWeight', uniformFixedSizeArray(u64, 20)],
    ['fundWorth', u64],
    ['lastUpdateTime', u64],
    ['refilterInterval', u64],
    ['reweightInterval', u64],
    ['rebalanceInterval', u64],
    ['rebalanceThreshold', u64],
    ['rebalanceSlippage', u64],
    ['lpOffsetThreshold', u64],
    ['lastRefilterTime', u64],
    ['lastReweightTime', u64],
    ['rulesReady', u64],
    ['assetPool', uniformFixedSizeArray(u64, 200)],
    ['numOfRules', u64],
    ['rules', uniformFixedSizeArray(blob(320), 20)],
    ['numRuleTokens', u64],
    ['ruleTokens', uniformFixedSizeArray(u64, 20)],
    ['ruleTokenWeights', uniformFixedSizeArray(u64, 20)],
    ['messageDigestFive', uniformFixedSizeArray(u8, 16)],
    ['disableRebalance', u64],
    ['disableLp', u64],
    ['allowMultiAssetContribution', u8],
    ['symbolLength', u8],
    ['symbol', uniformFixedSizeArray(u8, 10)],
    ['nameLength', u8],
    ['name', uniformFixedSizeArray(u8, 60)],
    ['uriLength', u8],
    ['uri', uniformFixedSizeArray(u8, 300)],
    ['extraBytes', uniformFixedSizeArray(u8, 394)],
  ],
  (args) => args as Fund
);

export enum OracleType {
  PythOld,
  CustomSwitchboard,
  CustomStakePool,
  Pyth,
  SwitchboardOnDemand,
}

export type TokenSettings = {
  tokenMint: PublicKey;
  decimals: number;
  coingeckoId: number[];
  pdaTokenAccount: PublicKey;
  oracleType: OracleType;
  oracleAccount: PublicKey;
  oracleIndex: number;
  oracleConfidencePct: number;
  fixedConfidenceBps: number;
  tokenSwapFeeAfterTwBps: number;
  tokenSwapFeeBeforeTwBps: number;
  isLive: number;
  lpOn: number;
  useCurveData: number;
  additionalData: number[];
};

export const tokenSettingsStruct = new BeetStruct<TokenSettings>(
  [
    ['tokenMint', publicKey],
    ['decimals', u8],
    ['coingeckoId', uniformFixedSizeArray(u8, 30)],
    ['pdaTokenAccount', publicKey],
    ['oracleType', u8],
    ['oracleAccount', publicKey],
    ['oracleIndex', u8],
    ['oracleConfidencePct', u8],
    ['fixedConfidenceBps', u8],
    ['tokenSwapFeeAfterTwBps', u8],
    ['tokenSwapFeeBeforeTwBps', u8],
    ['isLive', u8],
    ['lpOn', u8],
    ['useCurveData', u8],
    ['additionalData', uniformFixedSizeArray(u8, 63)],
  ],
  (args) => args as TokenSettings
);

export type TokenList = {
  buffer: Buffer;
  numTokens: BigNumber;
  list: TokenSettings[];
};

export const tokenListStruct = new FixableBeetStruct<TokenList>(
  [
    ['buffer', blob(8)],
    ['numTokens', u64],
    ['list', uniformFixedSizeArray(tokenSettingsStruct, 200)],
  ],
  (args) => args as TokenList
);
