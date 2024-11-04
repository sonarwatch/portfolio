import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'spdr';
export const platform: Platform = {
  id: platformId,
  name: 'spdr Finance',
  image: 'https://sonar.watch/img/platforms/spdr.webp',
  website: 'https://www.spiderswap.io/staking',
  twitter: 'https://twitter.com/spdrswap',
  // defiLlamaId: 'spdr-finance', // from https://defillama.com/docs/api
};

export const pid = new PublicKey(
  'GTavkffQHnDKDH36YNFpk7uxwHNseTRo24tV4HGC8MNY'
);
export const spdrMint = 'AT79ReYU9XtHUTF5vM6Q4oa9K8w7918Fp5SU7G1MDMQY';
export const pool = new PublicKey(
  '2hJQSpUvDy2Byhs2Mc3HAy7atKHHELfYfycbZBErpn1X'
);
