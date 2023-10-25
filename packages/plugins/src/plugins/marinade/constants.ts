import { PublicKey } from '@solana/web3.js';
import { Platform, solanaNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

export const platformId = 'marinade';
export const marinadePlatform: Platform = {
  id: platformId,
  name: 'Marinade',
  image: 'https://sonar.watch/img/platforms/marinade.png',
  defiLlamaId: 'marinade-finance',
};

export const cachePrefix = 'marinade';
export const marinadeTicketProgramId = new PublicKey(
  'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD'
);
export const solFactor = new BigNumber(10 ** solanaNetwork.native.decimals);
