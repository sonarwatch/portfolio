import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'kamino';
export const kaminoPlatform: Platform = {
  id: platformId,
  name: 'Kamino',
  image: `https://sonar.watch/img/platforms/${platformId}.png`,
  defiLlamaId: 'kamino',
  website: 'https://kamino.finance/',
};
export const programId = new PublicKey(
  '6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc'
);
