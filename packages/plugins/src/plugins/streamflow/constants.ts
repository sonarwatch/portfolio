import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'streamflow';
export const streamflowPlatform: Platform = {
  id: platformId,
  name: 'Streamflow',
  image: 'https://sonar.watch/img/platforms/streamflow.png',
  defiLlamaId: 'streamflow', // from https://defillama.com/docs/api
  website: 'https://app.streamflow.finance/',
  twitter: 'https://twitter.com/streamflow_fi',
};

export const streamflowProgramId = new PublicKey(
  'strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m'
);
