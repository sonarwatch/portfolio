import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'futarchy';
export const platform: Platform = {
  id: platformId,
  name: 'Futarchy',
  image: 'https://sonar.watch/img/platforms/metadao.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://futarchy.metadao.fi/',
  twitter: 'https://x.com/MetaDAOProject',
};

export const daoPid = new PublicKey(
  'autoQP9RmUNkzzKRXsMkWicDVZ3h29vvyMDcAYjCxxg'
);

export const daoNameById: Map<string, string> = new Map([
  ['CNMZgxYsQpygk8CLN9Su1igwXX2kHtcawaNAGuBPv3G9', 'MetaDAO '],
  ['5vVCYQHPd8o3pGejYWzKZtnUSdLjXzDZcjZQxiFumXXx', 'Drift '],
  ['ofvb3CPvEyRfD5az8PAqW6ATpPqVBeiB5zBnpPR5cgm', 'Future '],
  ['9TKh2yav4WpSNkFV2cLybrWZETBWZBkQ6WB6qV9Nt9dJ', "Dean's List "],
  ['EqgPmuKVugfsjjUpxNtqeTkM34oh2H3BVvEfFJTo2Uj5', 'Manifesto '],
]);
