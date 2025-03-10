import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'foo';
export const platform: Platform = {
  id: platformId,
  name: 'Foo Finance',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/foo.webp',
  website: 'https://foo.com/',
  twitter: 'https://x.com/foo_finance',
  defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};
export const marketsCacheKey = `markets`;

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://foo.com/claim',
  emitterLink: 'https://foo.com',
  emitterName: 'Foo Protocol',
  id: 'foo-s1',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/foo.webp',
  claimEnd: undefined,
  claimStart: 1722672000000,
};
