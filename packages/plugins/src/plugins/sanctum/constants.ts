import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'sanctum';
export const platformImage = 'https://sonar.watch/img/platforms/sanctum.webp';
export const platformWebsite = 'https://www.sanctum.so/';
export const cloudMint = 'CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu';
export const platform: Platform = {
  id: platformId,
  defiLlamaId: 'parent#sanctum', // from https://defillama.com/docs/api
  name: 'Sanctum',
  image: platformImage,
  website: platformWebsite,
  twitter: 'https://twitter.com/sanctumso',
  discord: 'discord.gg/sanctumso',
  documentation: 'https://learn.sanctum.so/docs',
  github: 'https://github.com/igneous-labs',
  tokens: [cloudMint],
  description:
    'Sanctum is a new primitive built on Solana to power liquid staking and bring Solana into an infinite-LST future. Sanctum enables users that stake SOL natively or with a liquid staking token (LST) to tap into a powerful unified liquidity layer.',
};
export const lstsKey = 'lsts';

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

export const stakingPid = new PublicKey(
  'bon4Kh3x1uQK16w9b9DKgz3Aw4AP1pZxBJk55Q6Sosb'
);
