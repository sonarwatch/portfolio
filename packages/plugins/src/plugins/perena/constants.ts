import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'perena';
export const platform: Platform = {
  id: platformId,
  name: 'Perena',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/perena.webp',
  website: 'https://perena.org/numeraire',
  twitter: 'https://x.com/Perena__',
  description:
    'Perena is building the infrastructure for stablecoins on Solana, starting with a novel AMM, Numéraire.',
  documentation:
    'https://perena.notion.site/Product-Documentation-15fa37a29ca48060afd9cabb21b44d5c',
  telegram: 'https://t.me/perena_community',
  defiLlamaId: 'perena',
  discord: 'https://discord.com/invite/vaNnNBqXMt',
};

export const pid = new PublicKey('NUMERUNsFCP3kuNmWZuXtm1AaQCPj9uw6Guv2Ekoi5P');
