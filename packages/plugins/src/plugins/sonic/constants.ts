import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const sonicMint = 'SonicxvLud67EceaEzCLRnMTBqzYUUYNr93DBkBdDES';
export const platformId = 'sonic';

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://airdrop.sonic.game/',
  emitterLink: 'https://www.sonic.game/',
  emitterName: 'Sonic',
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
