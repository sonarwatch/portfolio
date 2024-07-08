import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'orca';
export const platform: Platform = {
  id: platformId,
  name: 'Orca',
  image: 'https://sonar.watch/img/platforms/orca.webp',
  defiLlamaId: 'orca',
  website: 'https://www.orca.so/',
};
export const poolsProgram = new PublicKey(
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP'
);
export const aquafarmsProgram = new PublicKey(
  '82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ'
);

export const positionsIdentifier = 'Orca Whirlpool Position';
export const whirlpoolPrefix = `${platformId}-whirlpool`;
export const whirlpoolProgram = new PublicKey(
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc'
);
