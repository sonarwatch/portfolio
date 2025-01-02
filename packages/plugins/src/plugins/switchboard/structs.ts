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

export type PullFeedAccountDataResult = {
  value: BigNumber;
  std_dev: BigNumber;
  mean: BigNumber;
  range: BigNumber;
  min_value: BigNumber;
  max_value: BigNumber;
  num_samples: number;
  submission_idx: number;
  padding1: number[];
  slot: BigNumber;
};

export const pullFeedAccountDataResultStruct =
  new BeetStruct<PullFeedAccountDataResult>(
    [
      ['value', i128],
      ['std_dev', i128],
      ['mean', i128],
      ['range', i128],
      ['min_value', i128],
      ['max_value', i128],
      ['num_samples', u8],
      ['submission_idx', u8],
      ['padding1', uniformFixedSizeArray(u8, 6)],
      ['slot', u64],
    ],
    (args) => args as PullFeedAccountDataResult
  );

export type OracleSubmission = {
  oracle: PublicKey;
  slot: BigNumber;
  landed_at: BigNumber;
  value: BigNumber;
};

export const oracleSubmissionStruct = new BeetStruct<OracleSubmission>(
  [
    ['oracle', publicKey],
    ['slot', u64],
    ['landed_at', u64],
    ['value', i128],
  ],
  (args) => args as OracleSubmission
);

export type PullFeedAccountData = {
  buffer: Buffer;
  submissions: OracleSubmission[];
  authority: PublicKey;
  queue: PublicKey;
  feed_hash: number[];
  initialized_at: BigNumber;
  permissions: BigNumber;
  max_variance: BigNumber;
  min_responses: BigNumber;
  name: number[];
  padding1: number[];
  historical_result_idx: number;
  min_sample_size: number;
  last_update_timestamp: BigNumber;
  lut_slot: BigNumber;
  _reserved1: number[];
  result: PullFeedAccountDataResult;
};

export const pullFeedAccountDataStruct = new BeetStruct<PullFeedAccountData>(
  [
    ['buffer', blob(8)],
    ['submissions', uniformFixedSizeArray(oracleSubmissionStruct, 32)],
    ['authority', publicKey],
    ['queue', publicKey],
    ['feed_hash', uniformFixedSizeArray(u8, 32)],
    ['initialized_at', i64],
    ['permissions', u64],
    ['max_variance', u64],
    ['min_responses', u32],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['padding1', uniformFixedSizeArray(u8, 2)],
    ['historical_result_idx', u8],
    ['min_sample_size', u8],
    ['last_update_timestamp', i64],
    ['lut_slot', u64],
    ['_reserved1', uniformFixedSizeArray(u8, 32)],
    ['result', pullFeedAccountDataResultStruct],
  ],
  (args) => args as PullFeedAccountData
);
