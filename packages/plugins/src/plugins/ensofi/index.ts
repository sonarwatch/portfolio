import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import suiLoansJob from './suiLoansJob';
import suiLoansFetcher from './suiLoansFetcher';
import solanaLoansFetcher from './solanaLoansFetcher';
import solanaLoansJob from './solanaLoansJob';
import solanaLiquidityFetcher from './solanaLiquidityFetcher';
import solanaLoansFlexFetcher from './solanaLoansFlexFetcher';

export const jobs: Job[] = [suiLoansJob, solanaLoansJob];
export const fetchers: Fetcher[] = [
  suiLoansFetcher,
  solanaLoansFetcher,
  solanaLoansFlexFetcher,
  solanaLiquidityFetcher,
];
