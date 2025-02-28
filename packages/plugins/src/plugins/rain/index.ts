import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import collectionsJob from './collectionsJob';
import banksFetcher from './banksFetcher';
import defiBorrowsFetcher from './defiBorrowsFetcher';
import nftBorrowsFetcher from './nftBorrowsFetcher';
import defiPoolsFetcher from './defiPoolsFetcher';
import nftPoolsFetcher from './nftPoolsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [collectionsJob];
export const fetchers: Fetcher[] = [
  defiBorrowsFetcher,
  nftBorrowsFetcher,
  defiPoolsFetcher,
  nftPoolsFetcher,
  banksFetcher,
];
