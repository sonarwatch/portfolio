import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { CitrusIDL } from './idl';
import { IdlItem } from '@solanafm/explorer-kit-idls';

export const platformId = 'citrus';
export const platform: Platform = {
  id: platformId,
  name: 'Citrus',
  image: 'https://sonar.watch/img/platforms/citrus.webp',
  website: 'https://citrus.famousfoxes.com/',
  twitter: 'https://twitter.com/FamousFoxFed',
  defiLlamaId: 'citrus', // from https://defillama.com/docs/api
};
export const collectionsCacheKey = `${platformId}-collections`;
export const cachePrefix = `${platformId}`;

export const citrusProgram = new PublicKey(
  'JCFRaPv7852ESRwJJGRy2mysUMydXZgVVhrMLmExvmVp'
);

export const collectionDataSize = 808;
export const loanDataSize = 464;

export const citrusIdlItem = {
  programId: citrusProgram.toString(),
  idl: CitrusIDL,
  idlType: 'anchor',
} as IdlItem;
