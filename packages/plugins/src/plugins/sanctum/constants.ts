import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'sanctum';
export const platformImage = 'https://sonar.watch/img/platforms/sanctum.webp';
export const platformWebsite = 'https://www.sanctum.so/';
export const platform: Platform = {
  id: platformId,
  defiLlamaId: 'parent#sanctum', // from https://defillama.com/docs/api
  name: 'Sanctum',
  image: platformImage,
  website: platformWebsite,
  twitter: 'https://twitter.com/sanctumso',
};
export const lstsKey = 'lsts';

export const airdropStatics: AirdropStatics = {
  id: 'sanctum',
  claimLink: 'https://app.sanctum.so/wonderland',
  image: platformImage,
  emitterLink: platformWebsite,
  emitterName: 'Sanctum',
  claimStart: undefined,
  claimEnd: undefined,
};
