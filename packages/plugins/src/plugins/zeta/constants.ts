import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'zeta';
export const platform: Platform = {
  id: platformId,
  name: 'Zeta',
  image: 'https://sonar.watch/img/platforms/zeta.png',
  defiLlamaId: 'zeta',
  website: 'https://www.zeta.markets/',
};

export const programId = new PublicKey(
  'ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD'
);
export const graphqlApi = 'https://api-gql.zeta.markets/graphql';
export const zexMint = 'ZEXy1pqteRu3n13kdyh4LwPQknkFk3GzmMYMuNadWPo';
export const zexDecimals = 6;
