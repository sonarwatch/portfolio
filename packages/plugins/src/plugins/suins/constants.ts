import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'suins';
export const platform: Platform = {
  id: platformId,
  name: 'Sui Name Service',
  image: 'https://sonar.watch/img/platforms/suins.webp',
  website: 'https://suins.io/',
  twitter: 'https://x.com/suinsdapp',
  defiLlamaId: 'suins', // from https://defillama.com/docs/api
};
export const airdropStatics: AirdropStatics = {
  emitterLink: 'https://token.suins.io/',
  emitterName: 'Sui NS',
  id: `${platformId}-token-launch`,
  image: 'https://sonar.watch/img/platforms/suins.webp',
  claimEnd: undefined,
  claimStart: undefined,
};

export const nsMint = undefined;
export const nsDecimals = 6;
