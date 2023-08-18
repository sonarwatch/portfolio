import { PublicKey } from '@solana/web3.js';

export const platformId = 'orca';

export const aquafarmsPrefix = `${platformId}-aquafarms`;
export const aquafarmsProgram = new PublicKey(
  '82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ'
);

export const positionsIdentifier = 'Orca Whirlpool Position';
export const whirlpoolPrefix = `${platformId}-whirlpool`;
export const whirlpoolProgram = new PublicKey(
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc'
);
export const whirlpoolConfig = new PublicKey(
  '2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ'
);
export const apiWhirlpool = 'https://api.mainnet.orca.so/v1/whirlpool/list';
