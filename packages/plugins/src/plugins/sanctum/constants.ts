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

export const cloudMint = 'CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu';
export const cloudDecimals = 9;
export const s1AirdropStatics: AirdropStatics = {
  id: 'sanctum',
  claimStart: 1721314800000,
  claimEnd: 1744588800000,
  emitterName: 'Sanctum',
  emitterLink: platformWebsite,
  claimLink: 'https://lfg.jup.ag/sanctum',
  image: platformImage,
};

export const nclbAirdropStatics: AirdropStatics = {
  id: 'sanctum-nclb',
  claimStart: undefined,
  claimEnd: undefined,
  emitterName: 'Sanctum',
  emitterLink: platformWebsite,
  claimLink: 'https://appeal.sanctum.so/results',
  image: platformImage,
};
