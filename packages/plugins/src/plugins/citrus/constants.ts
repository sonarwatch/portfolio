import { PublicKey } from '@solana/web3.js';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { CitrusIDL } from './idl';

export const platformId = 'citrus';
export const collectionsCacheKey = `${platformId}-collections`;
export const cachePrefix = `${platformId}`;

export const collectionsApiUrl =
  'https://citrus.famousfoxes.com/citrus/allCollections';

export const citrusProgram = new PublicKey(
  'JCFRaPv7852ESRwJJGRy2mysUMydXZgVVhrMLmExvmVp'
);

export const loanDataSize = 464;

export const citrusIdlItem = {
  programId: citrusProgram.toString(),
  idl: CitrusIDL,
  idlType: 'anchor',
} as IdlItem;
