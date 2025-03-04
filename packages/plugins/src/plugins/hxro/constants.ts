import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'hxro';
export const platform: Platform = {
  id: platformId,
  name: 'Hxro',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/hxro.webp',
  website: 'https://app.hxro.finance/',
  twitter: 'https://twitter.com/HxroNetwork',
  defiLlamaId: 'hxro-network', // from https://defillama.com/docs/api
};

export const pid = new PublicKey(
  '2jmux3fWV5zHirkEZCoSMEgTgdYZqkE9Qx2oQnxoHRgA'
);
export const hxroMint = 'HxhWkVpk5NS4Ltg5nij2G671CKXFRKPK8vy271Ub4uEK';
