import { PublicKey } from '@solana/web3.js';

export const platformId = 'ratex';

export const programIdLookupTable = new PublicKey(
  'C3Nz4KTqECwzJN7it4xarWz3vZDxidQ9UQj2v6exgBS5'
);

export const programIdLookupTableV2 = new PublicKey(
  'J1NBWaniyDdnnm4dsdTXKmNJog5p4ye1AtVeqkkrUFyM'
);

export const programsCacheKey = 'programs';
export const poolPrefix = `${platformId}-pool`;
