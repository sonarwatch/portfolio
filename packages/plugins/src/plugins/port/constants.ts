import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'port';
export const platform: Platform = {
  id: platformId,
  name: 'Port',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/port.webp',
  defiLlamaId: 'port-finance', // from https://defillama.com/docs/api
  website: 'https://mainnet.port.finance/lending',
  // twitter: 'https://twitter.com/myplatform',
  github: 'https://github.com/port-finance',
  isDeprecated: true,
  tokens: ['PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y'],
};

export const portApi = 'https://api-v1.port.finance';
export const programId = new PublicKey(
  'Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR'
);
