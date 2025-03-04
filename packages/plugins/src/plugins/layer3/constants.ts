import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'layer3';
export const platform: Platform = {
  id: platformId,
  name: 'Layer3',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/layer3.webp',
  website: 'https://solana.layer3.xyz/',
};

export const programId = new PublicKey(
  'HE6bCtjsrra8DRbJnexKoVPSr5dYs57s3cuGHfotiQbq'
);
export const l3Mint = new PublicKey(
  '5k84VjAKoGPXa7ias1BNgKUrX7e61eMPWhZDqsiD4Bpe'
);
