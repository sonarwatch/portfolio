import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'aurory';
export const platform: Platform = {
  id: platformId,
  name: 'Aurory',
  image: 'https://sonar.watch/img/platforms/aurory.png',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://app.aurory.io',
  twitter: 'https://twitter.com/AuroryProject',
};

export const programId = new PublicKey(
  'StKLLTf7CQ9n5BgXPSDXENovLTCuNc7N2ehvTb6JZ5x'
);

export const auryMint = 'AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP';
export const xAuryMint = 'xAURp5XmAG7772mfkSy6vRAjGK9JofYjc3dmQDWdVDP';
export const decimals = 9;
export const vaultPubkey = 'FysGks3izhgVhrUkub9QQWCTEVAdhkZKYSNK2F25maGD';
