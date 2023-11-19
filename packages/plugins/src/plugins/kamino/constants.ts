import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'kamino';
export const kaminoPlatform: Platform = {
  id: platformId,
  name: 'Kamino',
  image: `https://sonar.watch/img/platforms/${platformId}.png`,
  website: 'https://kamino.finance/',
  defiLlamaId: 'parent#kamino-finance',
};
export const programId = new PublicKey(
  '6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc'
);

export const klendProgramId = new PublicKey(
  'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD'
);
