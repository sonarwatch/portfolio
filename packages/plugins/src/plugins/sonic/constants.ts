import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'sonic';
export const platform: Platform = {
  id: platformId,
  name: 'Sonic',
  image: 'https://sonar.watch/img/platforms/sonic.webp',
  website: 'https://www.sonic.game/',
  twitter: 'https://x.com/SonicSVM',
};

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://airdrop.sonic.game/',
  emitterLink: 'https://www.sonic.game/',
  emitterName: platform.name,
  id: 'sonic-airdrop',
  image: 'https://sonar.watch/img/platforms/sonic.webp',
  claimStart: 1736251200000,
  claimEnd: 1738929600000,
};

export const airdropApi = 'https://airdrop.sonic.game/api/allocations?wallet=';

export const sonicMint = 'SonicxvLud67EceaEzCLRnMTBqzYUUYNr93DBkBdDES';
export const stakingPid = new PublicKey(
  'g3yMgSB3Q7gNjMfSoCm1PiJihqHdNJeUuPHvRyf45qY'
);
