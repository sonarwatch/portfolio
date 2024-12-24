import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'ratex';
export const platform: Platform = {
  id: platformId,
  name: 'RateX',
  image: 'https://static.rate-x.io/img/v1/26f59f/ratex-logo.png',
  website: 'https://rate-x.io/',
  twitter: 'https://x.com/RateX_Dex',
  defiLlamaId: 'ratex',
};


export const programIdLookupTable = new PublicKey('Es56bH1dokFwohpWS8XYSfTXavvSEuyob2FnUYzF6pCL');
