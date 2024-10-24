import { Fetcher } from '../../Fetcher';
import { airdropFetcher } from './helpersAirdrop';
import { airdropFetcherToFetcher } from '../../AirdropFetcher';
import { airdropStatics, platformId } from './constants';

const fetcher: Fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platformId,
  `${platformId}-airdrop`,
  airdropStatics.claimEnd
);

export default fetcher;
