import { Fetcher } from '../../Fetcher';
import { airdropFetcher } from './helpersAirdrop';
import { airdropFetcherToFetcher } from '../../AirdropFetcher';
import { airdropStaticsS1, platformId } from './constants';

const fetcher: Fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platformId,
  `${platformId}-airdrop`,
  airdropStaticsS1.claimEnd
);

export default fetcher;
