import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import job from './getPairs';
import fetcher from './fetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [job];
export const fetchers: Fetcher[] = [fetcher(NetworkId.fraxtal)];
