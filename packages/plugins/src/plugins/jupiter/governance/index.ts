import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  AirdropFetcher,
  airdropFetcherToFetcher,
} from '../../../AirdropFetcher';
import {
  asr1Config,
  asr1Statics,
  asr2Config,
  asr2Statics,
  asr3Config,
  asr3Statics,
  platformId,
} from './constants';
import { getAsrAirdropExecutor } from './asrAirdropFetcher';

export const asr1AirdropFetcher: AirdropFetcher = {
  id: asr1Statics.id,
  networkId: NetworkId.solana,
  executor: getAsrAirdropExecutor(asr1Config),
};

export const asr1Fetcher = airdropFetcherToFetcher(
  asr1AirdropFetcher,
  platformId,
  `${platformId}-asr-1`,
  asr1Statics.claimEnd
);

export const asr2AirdropFetcher: AirdropFetcher = {
  id: asr2Statics.id,
  networkId: NetworkId.solana,
  executor: getAsrAirdropExecutor(asr2Config),
};
export const asr2Fetcher = airdropFetcherToFetcher(
  asr2AirdropFetcher,
  platformId,
  `${platformId}-asr-2`,
  asr2Statics.claimEnd
);

export const asr3AirdropFetcher: AirdropFetcher = {
  id: asr3Statics.id,
  networkId: NetworkId.solana,
  executor: getAsrAirdropExecutor(asr3Config),
};
export const asr3Fetcher = airdropFetcherToFetcher(
  asr3AirdropFetcher,
  platformId,
  `${platformId}-asr-3`,
  asr3Statics.claimEnd
);
