import { Fetcher } from '../../Fetcher';
import { airdropStatics, platformId } from './constants';
import { airdropFetcher } from './helpersAirdrop';
import { airdropFetcherToFetcher } from '../../AirdropFetcher';

const fetcher: Fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platformId,
  `${platformId}-airdrop`,
  airdropStatics.claimEnd
);

export default fetcher;
