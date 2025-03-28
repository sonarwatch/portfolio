import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'adrena';
export const adxMint = 'AuQaustGiaqxRvj2gtCdrd22PBzTn8kM3kEPEkZCtuDw';
export const alpMint = '4yCLi5yWGzpTWMQ1iWHG5CrGYAdBkhyEdsuSugjDUqwj';

export const platform: Platform = {
  id: platformId,
  name: 'Adrena',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/adrena.webp',
  website: 'https://app.adrena.xyz/',
  twitter: 'https://x.com/AdrenaProtocol',
  defiLlamaId: 'adrena-protocol', // from https://defillama.com/docs/api
  discord: 'https://discord.gg/adrena',
  description:
    'Adrena is a decentralized protocol for borrowing and lending on Solana.',
  documentation: 'https://docs.adrena.xyz/',
  github: 'https://github.com/orgs/AdrenaFoundation',
  tokens: [adxMint, alpMint],
};

export const custodiesCacheKey = `custodies`;
export const pid = new PublicKey(
  '13gDzEXCdocbj8iAiqrScGo47NiSuYENGsRqi3SEAwet'
);
