import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'hxro';
export const hxroMint = 'HxhWkVpk5NS4Ltg5nij2G671CKXFRKPK8vy271Ub4uEK';
export const platform: Platform = {
  id: platformId,
  name: 'Hxro',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/hxro.webp',
  website: 'https://app.hxro.finance/',
  twitter: 'https://twitter.com/HxroNetwork',
  defiLlamaId: 'hxro-network', // from https://defillama.com/docs/api
  github: 'https://github.com/Hxro-Network',
  documentation: 'https://docs.hxro.network/',
  discord: 'https://discord.com/invite/8rWajs2Dqu',
  tokens: [hxroMint],
  description:
    'Hxro Network protocols power a diverse set of community–built derivatives trading and betting applications on Solana. The network aims to create the most liquid markets for Solana-based assets while enabling its ecosystem to participate in the value it accrues.',
};

export const pid = new PublicKey(
  '2jmux3fWV5zHirkEZCoSMEgTgdYZqkE9Qx2oQnxoHRgA'
);
