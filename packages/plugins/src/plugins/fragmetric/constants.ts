import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'fragmetric';
export const platform: Platform = {
  id: platformId,
  name: 'Fragmetric',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/fragmetric.webp',
  website: 'https://fragmetric.xyz/',
  twitter: 'https://x.com/fragmetric',
  defiLlamaId: 'fragmetric',
  description:
    'Fragmetric is a native liquid restaking protocol on Solana that aims to improve the economic potential and security of the Solana ecosystem.',
  discord: 'https://discord.gg/fragmetric',
  documentation: 'https://docs.fragmetric.xyz/',
  github: 'https://github.com/fragmetric-labs',
  tokens: [
    'WFRGSWjaz8tbAxsJitmbfRuFV2mSNwy7BMWcCwaA28U',
    'FRAGSEthVFL7fdqM8hxfxkfCZzUvmg21cqPJVvC1qdbo',
    'FRAGJ157KSDfGvBJtCSrsTWUqFnZhrw4aC8N8LqHuoos',
  ],
};

export const fragmetricPid = new PublicKey(
  'fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3'
);

// https://api.fragmetric.xyz/v1/graphql operationName "fragmetricStats"
export const vaults = [
  {
    vaultProgramAddress: 'HR1ANmDHjaEhknvsTaK48M5xZtbBiwNdXM5NTiWhAb4S',
    receiptToken: 'FRAGSEthVFL7fdqM8hxfxkfCZzUvmg21cqPJVvC1qdbo',
    normalizedTokenPoolAccount: 'AkbZvKxUAxMKz92FF7g5k2YLCJftg8SnYEPWdmZTt3mp',
    reserveAccount: '4khv6c8D6SqJpi8tUNX5TyVFYKojbpgV1zSE4VAaT68T',
  },
  {
    vaultProgramAddress: 'BmJvUzoiiNBRx3v2Gqsix9WvVtw8FaztrfBHQyqpMbTd',
    receiptToken: 'FRAGJ157KSDfGvBJtCSrsTWUqFnZhrw4aC8N8LqHuoos',
    tokenMint: 'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL',
    reserveAccount: '3Fz1WVV7N3h5VScoveHyote6Y129F3Gmc3PcfnBuSbV3',
  },
];
