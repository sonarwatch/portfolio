import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const spdrMint = 'AT79ReYU9XtHUTF5vM6Q4oa9K8w7918Fp5SU7G1MDMQY';

export const platformId = 'spdr';
export const platform: Platform = {
  id: platformId,
  name: 'Spiderswap',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/spdr.webp',
  website: 'https://www.spiderswap.io/staking',
  twitter: 'https://twitter.com/spdrswap',
  // defiLlamaId: 'spdr-finance', // from https://defillama.com/docs/api
  documentation: 'https://webpaper.spiderswap.io/whitepaper',
  discord: 'https://discord.com/invite/spiderswap',
  telegram: 'https://t.me/Tolysspider',
  tokens: [spdrMint],
  description: 'Aggregator for Everyone',
  github: 'https://github.com/itsmodsiw/spidy',
};

export const pid = new PublicKey(
  'GTavkffQHnDKDH36YNFpk7uxwHNseTRo24tV4HGC8MNY'
);
export const pool = new PublicKey(
  '2hJQSpUvDy2Byhs2Mc3HAy7atKHHELfYfycbZBErpn1X'
);
