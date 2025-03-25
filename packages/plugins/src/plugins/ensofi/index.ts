import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import suiLoansJob from './suiLoansJob';
import suiLoansFetcher from './suiLoansFetcher';
import solanaLoansFetcher from './solanaLoansFetcher';
import solanaLoansJob from './solanaLoansJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [suiLoansJob, solanaLoansJob];
export const fetchers: Fetcher[] = [suiLoansFetcher, solanaLoansFetcher];
