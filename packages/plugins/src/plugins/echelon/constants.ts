import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'echelon';
export const platform: Platform = {
  id: platformId,
  name: 'Echelon',
  image: 'https://sonar.watch/img/platforms/echelon.webp',
  defiLlamaId: 'echelon-market', // from https://defillama.com/docs/api
  website: 'https://app.echelon.market',
  twitter: 'https://twitter.com/EchelonMarket',
};

export const echelonPackage = `0xc6bc659f1649553c1a3fa05d9727433dc03843baac29473c817d06d39e7621ba::lending::`;
export const marketKey = `markets`;
export const vaultType = `${echelonPackage}Vault`;
export const coinInfoType = `${echelonPackage}CoinInfo`;
