import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import suiFetcher from './suiFetcher';
import aptosFetcher from './aptosFetcher';
import solanaFetcher from './solanaFetcher';
import aptosValidatorsJob from './activeValidatorsJob';

export const jobs: Job[] = [aptosValidatorsJob];
export const fetchers: Fetcher[] = [suiFetcher, aptosFetcher, solanaFetcher];
