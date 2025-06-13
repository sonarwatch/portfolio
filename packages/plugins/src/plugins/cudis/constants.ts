import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'cudis';
export const cudisMint = 'CudisfkgWvMKnZ3TWf6iCuHm8pN2ikXhDcWytwz6f6RN';
export const airdropApi = 'https://cudis-api.cudis.xyz/basic/userDetail';

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://app.cudis.xyz/airdrop',
  emitterLink: 'https://app.cudis.xyz/',
  emitterName: 'CUDIS',
  id: 'cudis-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/cudis.webp',
  claimStart: 1749124800000,
  claimEnd: 1756641600000,
};

export const stakingPid = new PublicKey(
  'H3tzuPeKMHd1Wee4JyuYbwKX6pHTcKGDgPw8caVNTvQu'
);
