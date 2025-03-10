import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'flexlend';
export const platform: Platform = {
  id: platformId,
  name: 'LuLo',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/lulo.webp',
  defiLlamaId: 'lulo',
  website: 'https://www.lulo.fi',
  twitter: 'https://twitter.com/uselulo',
  github: 'https://github.com/lulo-labs',
  documentation: 'https://docs.lulo.fi/',
  discord: 'https://discord.com/invite/lulo',
  telegram: 'https://t.me/uselulo',
  description:
    'Lulo is a decentralized lending aggregator, which automatically optimizes users deposits by migrating their deposits to the lending pool with the best yield, while allowing for personalized risk settings',
};

export const luloProgramId = new PublicKey(
  'FL3X2pRsQ9zHENpZSKDRREtccwJuei8yg9fwDu9UN69Q'
);

export const AUTOMATION_PUBLIC_KEY = new PublicKey(
  '8PWR75ppAGonv9dXStjficjXmdsuDKmDoVNcy4oYhAMs'
);

export const poolsKey = 'allocations';
