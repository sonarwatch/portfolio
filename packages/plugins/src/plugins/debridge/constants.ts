import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'debridge';
export const platform: Platform = {
  id: platformId,
  name: 'deBridge',
  image: 'https://sonar.watch/img/platforms/debridge.webp',
  website: 'https://debridge.finance/',
  twitter: 'https://x.com/deBridgeFinance',
  defiLlamaId: 'debridge', // from https://defillama.com/docs/api
};
export const airdropStatics: AirdropStatics = {
  claimLink: 'https://debridge.foundation/',
  emitterLink: 'https://debridge.finance/',
  emitterName: 'deBridge',
  id: `${platformId}-token-launch`,
  image: 'https://sonar.watch/img/platforms/debridge.webp',
  claimEnd: undefined,
  claimStart: undefined,
};

export const dbrMint = undefined;
export const dbrDecimals = 6;
export const apiUrl =
  'https://points-api.debridge.foundation/api/TokenDistribution/';
