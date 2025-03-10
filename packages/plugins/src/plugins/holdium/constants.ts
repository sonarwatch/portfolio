import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'holdium';
export const platformImage = 'https://sonar.watch/img/platforms/holdium.webp';
export const platformWebsite = 'https://holdium.xyz/';
export const platform: Platform = {
  id: platformId,
  name: 'Holdium',
  image: platformImage,
  website: platformWebsite,
  twitter: 'https://twitter.com/holdiumxyz',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  telegram: 'https://t.me/holdium',
  description:
    'Holdium is a token designed exclusively for the diehard hodlers of the Solana Ecosystem—the ones with diamond hands, unwavering conviction, and nerves of steel. The real champions of the crypto community.',
};

export const airdropStatics: AirdropStatics = {
  id: 'holdium',
  claimLink: 'https://holdium.xyz/',
  image: platformImage,
  emitterLink: platformWebsite,
  emitterName: 'Holdium',
  claimStart: 1721080800000,
  claimEnd: undefined,
};
