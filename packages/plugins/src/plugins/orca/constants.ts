import { PublicKey } from '@solana/web3.js';

export const platformId = 'orca';
export const orcaStakingPlatformId = 'orca-staking';

export const poolsProgram = new PublicKey(
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP'
);
export const aquafarmsProgram = new PublicKey(
  '82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ'
);
export const whirlpoolProgram = new PublicKey(
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc'
);

export const positionsIdentifiers = ['Orca Whirlpool Position', 'OWP'];
export const whirlpoolPrefix = `${platformId}-whirlpool`;
