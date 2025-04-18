import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import collectionsJob from './collectionsJob';
import stJupJob from './stJupJob';
import banksFetcher from './banksFetcher';
import defiBorrowsFetcher from './defiBorrowsFetcher';
import nftBorrowsFetcher from './nftBorrowsFetcher';
import defiPoolsFetcher from './defiPoolsFetcher';
import nftPoolsFetcher from './nftPoolsFetcher';

export const jobs: Job[] = [collectionsJob, stJupJob];
export const fetchers: Fetcher[] = [
  defiBorrowsFetcher,
  nftBorrowsFetcher,
  defiPoolsFetcher,
  nftPoolsFetcher,
  banksFetcher,
];
