import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { SharkyIDL } from './idl';

export const platformId = 'sharky';
export const platform: Platform = {
  id: platformId,
  name: 'Sharky',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/sharky.webp',
  website: 'https://sharky.fi/',
  twitter: 'https://twitter.com/SharkyFi',
  defiLlamaId: 'sharky', // from https://defillama.com/docs/api
  discord: 'https://discord.gg/sharkyfi',
  github: 'https://github.com/SharkyFi',
  tokens: ['SHARKSYJjqaNyxVfrpnBN9pjgkhwDhatnMyicWPnr1s'],
  description:
    'Sharky is the first escrowless NFT lending and borrowing protocol on Solana. Users can borrow SOL against their NFTs or Lend SOL and earn a high % APY.',
};
export const collectionsCacheKey = `${platformId}-collections`;
export const cachePrefix = `${platformId}`;

export const sharkyProgram = new PublicKey(
  'SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP'
);

export const loanDataSize = 338;
export const orderBookDataSize = 10240;

export const sharkyIdlItem = {
  programId: sharkyProgram.toString(),
  idl: SharkyIDL,
  idlType: 'anchor',
} as IdlItem;
