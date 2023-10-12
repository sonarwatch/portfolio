import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'kamino';
export const kaminoPlatform: Platform = {
  id: platformId,
  name: 'Kamino',
  image: `https://alpha.sonar.watch/img/platforms/${platformId}.png`,
  defiLlamaId: 'kamino',
};
export const programId = new PublicKey(
  '6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc'
);
