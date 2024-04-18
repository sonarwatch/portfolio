import {
  BeetStruct,
  FixableBeetStruct,
  bool,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { blob, i64, u64, i128 } from '../../utils/solana';

export enum AggregatorResolutionMode {
  ModeRoundResolution,
  ModeSlidingResolution,
}

export type Hash = {
  data: number[];
};

export const hashStruct = new BeetStruct<Hash>(
  [['data', uniformFixedSizeArray(u8, 32)]],
  (args) => args as Hash
);

export type SwitchboardDecimal = {
  mantissa: BigNumber;
  scale: number;
};

export const switchboardDecimalStruct = new BeetStruct<SwitchboardDecimal>(
  [
    ['mantissa', i128],
    ['scale', u32],
  ],
  (args) => args as SwitchboardDecimal
);

export type AggregatorRound = {
  numSuccess: number;
  numError: number;
  isClosed: boolean;
  roundOpenSlot: BigNumber;
  roundOpenTimestamp: BigNumber;
  result: SwitchboardDecimal;
  stdDeviation: SwitchboardDecimal;
  minResponse: SwitchboardDecimal;
  maxResponse: SwitchboardDecimal;
  oraclePubkeysData: PublicKey[];
  mediansData: SwitchboardDecimal[];
  currentPayout: BigNumber[];
  mediansFulfilled: boolean[];
  errorsFulfilled: boolean[];
};

export const aggregatorRoundStruct = new FixableBeetStruct<AggregatorRound>(
  [
    ['numSuccess', u32],
    ['numError', u32],
    ['isClosed', bool],
    ['roundOpenSlot', u64],
    ['roundOpenTimestamp', i64],
    ['result', switchboardDecimalStruct],
    ['stdDeviation', switchboardDecimalStruct],
    ['minResponse', switchboardDecimalStruct],
    ['maxResponse', switchboardDecimalStruct],
    ['oraclePubkeysData', uniformFixedSizeArray(publicKey, 16)],
    ['mediansData', uniformFixedSizeArray(switchboardDecimalStruct, 16)],
    ['currentPayout', uniformFixedSizeArray(i64, 16)],
    ['mediansFulfilled', uniformFixedSizeArray(bool, 16)],
    ['errorsFulfilled', uniformFixedSizeArray(bool, 16)],
  ],
  (args) => args as AggregatorRound
);

export type AggregatorAccount = {
  buffer: Buffer;
  name: number[];
  metadata: number[];
  reserved1: number[];
  queuePubkey: PublicKey;
  oracleRequestBatchSize: number;
  minOracleResults: number;
  minJobResults: number;
  minUpdateDelaySeconds: number;
  startAfter: BigNumber;
  varianceThreshold: SwitchboardDecimal;
  forceReportPeriod: BigNumber;
  expiration: BigNumber;
  consecutiveFailureCount: BigNumber;
  nextAllowedUpdateTime: BigNumber;
  isLocked: boolean;
  crankPubkey: PublicKey;
  latestConfirmedRound: AggregatorRound;
  currentRound: AggregatorRound;
  jobPubkeysData: PublicKey[];
  jobHashes: Hash[];
  jobPubkeysSize: number;
  jobsChecksum: number[];
  authority: PublicKey;
  historyBuffer: PublicKey;
  previousConfirmedRoundResult: SwitchboardDecimal;
  previousConfirmedRoundSlot: BigNumber;
  disableCrank: boolean;
  jobWeights: number[];
  creationTimestamp: BigNumber;
  resolutionMode: AggregatorResolutionMode;
  basePriorityFee: number;
  priorityFeeBump: number;
  priorityFeeBumpPeriod: number;
  maxPriorityFeeMultiplier: number;
  parentFunction: PublicKey;
  ebuf: number[];
};

export const aggregatorAccountStruct = new FixableBeetStruct<AggregatorAccount>(
  [
    ['buffer', blob(8)],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['metadata', uniformFixedSizeArray(u8, 128)],
    ['reserved1', uniformFixedSizeArray(u8, 32)],
    ['queuePubkey', publicKey],
    ['oracleRequestBatchSize', u32],
    ['minOracleResults', u32],
    ['minJobResults', u32],
    ['minUpdateDelaySeconds', u32],
    ['startAfter', i64],
    ['varianceThreshold', switchboardDecimalStruct],
    ['forceReportPeriod', i64],
    ['expiration', i64],
    ['consecutiveFailureCount', u64],
    ['nextAllowedUpdateTime', i64],
    ['isLocked', bool],
    ['crankPubkey', publicKey],
    ['latestConfirmedRound', aggregatorRoundStruct],
    ['currentRound', aggregatorRoundStruct],
    ['jobPubkeysData', uniformFixedSizeArray(publicKey, 16)],
    ['jobHashes', uniformFixedSizeArray(hashStruct, 16)],
    ['jobPubkeysSize', u32],
    ['jobsChecksum', uniformFixedSizeArray(u8, 32)],
    ['authority', publicKey],
    ['historyBuffer', publicKey],
    ['previousConfirmedRoundResult', switchboardDecimalStruct],
    ['previousConfirmedRoundSlot', u64],
    ['disableCrank', bool],
    ['jobWeights', uniformFixedSizeArray(u8, 16)],
    ['creationTimestamp', i64],
    ['resolutionMode', u8],
    ['basePriorityFee', u32],
    ['priorityFeeBump', u32],
    ['priorityFeeBumpPeriod', u32],
    ['maxPriorityFeeMultiplier', u32],
    ['parentFunction', publicKey],
    ['ebuf', uniformFixedSizeArray(u8, 90)],
  ],
  (args) => args as AggregatorAccount
);
