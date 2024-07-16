import {
  AirdropFetcher,
  airdropFetcherToFetcher,
} from '../../../AirdropFetcher';
import { Fetcher } from '../../../Fetcher';
import { airdropConfigs } from './constants';
import { getLfgAirdropFetcher } from './lfgAirdropFetcher';

export const lfgAirdropFetchers: AirdropFetcher[] = airdropConfigs.map(
  (aConfig) => getLfgAirdropFetcher(aConfig)
);
export const lfgFetchers: Fetcher[] = lfgAirdropFetchers.map((aFetcher, i) => {
  const aConfig = airdropConfigs[i];
  return airdropFetcherToFetcher(
    aFetcher,
    aConfig.platformId,
    aConfig.statics.id,
    aConfig.statics.claimEnd
  );
});
