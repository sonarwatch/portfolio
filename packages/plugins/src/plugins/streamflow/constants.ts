import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'streamflow';
export const platform: Platform = {
  id: platformId,
  name: 'Streamflow',
  image: 'https://sonar.watch/img/platforms/streamflow.webp',
  defiLlamaId: 'streamflow', // from https://defillama.com/docs/api
  website: 'https://app.streamflow.finance/',
  twitter: 'https://twitter.com/streamflow_fi',
};
export const streamMint = undefined;
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
  image: 'https://sonar.watch/img/platforms/streamflow.webp',
  claimEnd: 1765512000000,
  claimStart: 1742216400000,
};
