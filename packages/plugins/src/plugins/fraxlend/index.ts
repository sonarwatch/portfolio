import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import pairsJob from './pairsJob';
import getLendingPositions from './getLendingPositions';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [pairsJob];
export const fetchers: Fetcher[] = [getLendingPositions(NetworkId.fraxtal)];
