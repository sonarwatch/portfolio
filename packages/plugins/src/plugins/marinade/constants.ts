import { PublicKey } from '@solana/web3.js';
import { Platform, solanaNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

export const platformId = 'marinade';
export const marinadePlatform: Platform = {
  id: platformId,
  name: 'Marinade',
  image: 'https://sonar.watch/img/platforms/marinade.png',
  defiLlamaId: 'parent#marinade-finance',
  website: 'https://marinade.finance/',
};

export const cachePrefix = 'marinade';
export const marinadeTicketProgramId = new PublicKey(
  'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD'
);
export const claimProgram = new PublicKey(
  'indiXdKbsC4QSLQQnn6ngZvkqfywn6KgEeQbkGSpk1V'
);
export const mndeMint = 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey';
export const solFactor = new BigNumber(10 ** solanaNetwork.native.decimals);
export const baseRewardsUrl =
  'https://native-staking-referral.marinade.finance/v1/rewards/';
export const season2Route = 'all/season-2?pubkey=';
export const stakerRoute = 'staker?pubkey=';
export const referrerRoute = 'referrer?pubkey=';
