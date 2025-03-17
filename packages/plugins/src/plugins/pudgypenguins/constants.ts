import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'pudgy';
export const pudgyMint = '2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv';
export const platform: Platform = {
  id: platformId,
  name: 'Pudgy Penguins',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/pudgypenguins.webp',
  website: 'https://pudgypenguins.com/',
  twitter: 'https://x.com/pudgypenguins',
  discord: 'discord.gg/pudgypenguins',
  tokens: [pudgyMint],
};

export const airdropApi =
  'https://api.clusters.xyz/v0.1/airdrops/pengu/eligibility/';

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://claim.pudgypenguins.com/',
  emitterLink: 'https://pudgypenguins.com/',
  emitterName: 'Pudgy Penguins',
  id: 'pudgy-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/pudgypenguins.webp',
  claimStart: 1734440400000,
  claimEnd: 1742043600000,
};
