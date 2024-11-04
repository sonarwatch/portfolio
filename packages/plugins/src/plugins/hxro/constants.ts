import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'hxro';
export const platform: Platform = {
  id: platformId,
  name: 'hxro Finance',
  image: 'https://sonar.watch/img/platforms/hxro.webp',
  website: 'https://hxro.com/',
  twitter: 'https://x.com/hxro_finance',
  defiLlamaId: 'hxro-finance', // from https://defillama.com/docs/api
};
export const marketsCacheKey = `markets`;

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://foo.com/claim',
  emitterLink: 'https://foo.com',
  emitterName: 'Foo Protocol',
  id: 'foo-s1',
  image: 'https://sonar.watch/img/platforms/foo.webp',
  claimEnd: undefined,
  claimStart: 1722672000000,
};

export const pid = new PublicKey(
  '2jmux3fWV5zHirkEZCoSMEgTgdYZqkE9Qx2oQnxoHRgA'
);
export const hxroMint = 'HxhWkVpk5NS4Ltg5nij2G671CKXFRKPK8vy271Ub4uEK';
