import { PublicKey } from '@solana/web3.js';
import {
  Contract,
  NetworkId,
  Platform,
  Service,
} from '@sonarwatch/portfolio-core';
import { usdcSolanaMint } from '../../utils/solana';

export const platformId = '01';
export const platform: Platform = {
  id: platformId,
  name: '01',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/01.webp',
  defiLlamaId: '01', // from https://defillama.com/docs/api
  website: 'https://01.xyz/',
  // twitter: 'https://twitter.com/myplatform',
};

export const programId = new PublicKey(
  'Zo1ggzTUKMY5bYnDvT5mtVeZxzf2FaLTbKkmvGUhUQk'
);

export const contract: Contract = {
  address: programId.toString(),
  name: 'Lending',
};

export const service: Service = {
  id: `${platformId}_lending`,
  platformId,
  name: 'Lending',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const mints = [
  usdcSolanaMint,
  'So11111111111111111111111111111111111111112',
  '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
  '9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i',
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
  '1111111111111111111111111111111111111111111',
];
