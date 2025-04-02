import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const streamMint = 'STREAMribRwybYpMmSYoCsQUdr6MZNXEqHgm7p1gu9M';
export const platformId = 'streamflow';
export const platformImg =
  'https://sonarwatch.github.io/portfolio/assets/images/platforms/streamflow.webp';
export const streamflowProgramId = new PublicKey(
  'strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m'
);

export const airdropApi =
  'https://api.streamflow.foundation/v2/api/airdrop-recipients/check-eligibility';

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://streamflow.foundation/',
  emitterLink: 'https://streamflow.foundation/',
  emitterName: 'Streamflow',
  id: 'streamflow-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/streamflow.webp',
  claimEnd: 1765512000000,
  claimStart: 1742216400000,
};
