import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'adrena';
export const platform: Platform = {
  id: platformId,
  name: 'Adrena',
  image: 'https://sonar.watch/img/platforms/adrena.webp',
  website: 'https://app.adrena.xyz/',
  twitter: 'https://x.com/AdrenaProtocol',
  defiLlamaId: 'adrena-protocol', // from https://defillama.com/docs/api
};

export const custodiesCacheKey = `custodies`;
export const pid = new PublicKey(
  '13gDzEXCdocbj8iAiqrScGo47NiSuYENGsRqi3SEAwet'
);
export const adxMint = 'AuQaustGiaqxRvj2gtCdrd22PBzTn8kM3kEPEkZCtuDw';
export const alpMint = '4yCLi5yWGzpTWMQ1iWHG5CrGYAdBkhyEdsuSugjDUqwj';
