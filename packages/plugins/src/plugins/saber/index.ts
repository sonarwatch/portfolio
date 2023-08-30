import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import lpTokensJob from './lpTokensJob';
import { saberPlatform } from './constants';

export const platforms: Platform[] = [saberPlatform];
export const jobs: Job[] = [lpTokensJob];
