import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'genesysgo';
export const shadowMint = 'SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y';
export const platform: Platform = {
  id: platformId,
  name: 'Genesysgo',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/genesysgo.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://testnet.shdwdrive.com/',
  twitter: 'https://twitter.com/genesysgo',
  github: 'https://github.com/GenesysGo',
  documentation: 'https://docs.shdwdrive.com/',
  discord: 'https://discord.com/invite/shdwdrive',
  tokens: [shadowMint],
  description:
    'The first & only decentralized data storage network powered exclusively by mobile devices. Scalable, secure, trustless.',
};

// https://github.com/chainsona/genesysgo-dagger-dashboard/blob/main/src/app/utils/shdw_reward_staking_pool.idl.json

export const programId = new PublicKey(
  'AvqeyEDqW9jaBi7yrRA6AxJtLbMzRY9NX75HuPTMoS4i'
);

export const shadowDecimals = 9;
