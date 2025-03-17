import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const streamMint = 'STREAMribRwybYpMmSYoCsQUdr6MZNXEqHgm7p1gu9M';
export const platformId = 'streamflow';
export const platform: Platform = {
  id: platformId,
  name: 'Streamflow',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/streamflow.webp',
  defiLlamaId: 'streamflow', // from https://defillama.com/docs/api
  website: 'https://app.streamflow.finance/',
  twitter: 'https://twitter.com/streamflow_fi',
  tokens: [streamMint],
  documentation: 'https://docs.streamflow.finance/en/',
  discord: 'https://discord.com/invite/streamflow-851921970169511976',
  github: 'https://github.com/streamflow-finance',
  medium: 'https://streamflow.medium.com/',
  description:
    'Streamflow exponentially grows on-chain economies by providing infrastructure for creation, distribution, and incentive alignment of tokens.',
};
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
