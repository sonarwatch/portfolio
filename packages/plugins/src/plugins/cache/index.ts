import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import getProgramCacheJob from './programsCacheJob';
import {
  mediumPrograms,
  ProgramCacheCategory,
  smallPrograms
} from './constants';

export const cachedPrograms = [...mediumPrograms, ...smallPrograms];
export const jobs: Job[] = [
  getProgramCacheJob(ProgramCacheCategory.SMALL, smallPrograms),
  getProgramCacheJob(ProgramCacheCategory.MEDIUM, mediumPrograms)
];
export const fetchers: Fetcher[] = [];
