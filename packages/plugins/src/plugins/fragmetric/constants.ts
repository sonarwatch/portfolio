import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'fragmetric';
export const platform: Platform = {
  id: platformId,
  name: 'Fragmetric',
  image: 'https://sonar.watch/img/platforms/fragmetric.webp',
  website: 'https://fragmetric.xyz/',
  twitter: 'https://x.com/fragmetric',
};

export const fragmetricPid = new PublicKey(
  'fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3'
);
export const nSOLReserve = new PublicKey(
  '4khv6c8D6SqJpi8tUNX5TyVFYKojbpgV1zSE4VAaT68T'
);
export const fragSOLMint = new PublicKey(
  'FRAGSEthVFL7fdqM8hxfxkfCZzUvmg21cqPJVvC1qdbo'
);
export const nSOLMint = 'nSoLnkrvh2aY792pgCNT6hzx84vYtkviRzxvhf3ws8e';
