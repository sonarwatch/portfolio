import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const sonicMint = 'SonicxvLud67EceaEzCLRnMTBqzYUUYNr93DBkBdDES';
export const platformId = 'sonic';
export const platform: Platform = {
  id: platformId,
  name: 'Sonic',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/sonic.webp',
  website: 'https://www.sonic.game/',
  twitter: 'https://x.com/SonicSVM',
  tokens: [sonicMint, 'sonickAJFiVLcYXx25X9vpF293udaWqDMUCiGtk7dg2'],
  discord: 'https://discord.com/invite/joinmirrorworld',
  documentation: 'https://docs.sonic.game/',
  github: 'https://github.com/mirrorworld-universe',
  description:
    'Sonic is the first atomic SVM chain designed to enable sovereign game economies on Solana. By utilizing the HyperGrid framework, Sonic offers unparalleled speed and scalability for on-chain gaming experiences.',
};

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://airdrop.sonic.game/',
  emitterLink: 'https://www.sonic.game/',
  emitterName: platform.name,
  id: 'sonic-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/sonic.webp',
  claimStart: 1736251200000,
  claimEnd: 1738929600000,
};

export const airdropApi = 'https://airdrop.sonic.game/api/allocations?wallet=';

export const stakingPid = new PublicKey(
  'g3yMgSB3Q7gNjMfSoCm1PiJihqHdNJeUuPHvRyf45qY'
);
