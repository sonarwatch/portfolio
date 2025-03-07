import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'phoenix';
export const platform: Platform = {
  id: platformId,
  name: 'Phoenix',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/phoenix.webp',
  website: 'https://www.phoenix.trade/',
  twitter: 'https://twitter.com/PhoenixTrade',
  defiLlamaId: 'phoenix', // from https://defillama.com/docs/api
  discord: 'discord.gg/ESaTYGzqpd',
  github: 'https://github.com/Ellipsis-Labs',
  documentation:
    'https://ellipsis-labs.gitbook.io/phoenix-dex/tRIkEFlLUzWK9uKO3W2V',
  description:
    'Phoenix is a decentralized limit order book on Solana, supporting markets for spot assets.',
};
export const marketsCachePrefix = `${platformId}-markets`;
export const phoenixPid = new PublicKey(
  'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY'
);
export const phoenixSeatManagerPid = new PublicKey(
  'PSMxQbAoDWDbvd9ezQJgARyq6R9L5kJAasaLDVcZwf1'
);
export const marketAccountSize = 445536;
