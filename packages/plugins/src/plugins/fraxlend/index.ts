import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import pairsJob from './pairsJob';
import getLendingPositions from './getLendingPositions';

export const jobs: Job[] = [pairsJob];
export const fetchers: Fetcher[] = [getLendingPositions(NetworkId.fraxtal)];
