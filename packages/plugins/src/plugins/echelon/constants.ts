import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'echelon';
export const platform: Platform = {
  id: platformId,
  name: 'Echelon',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/echelon.webp',
  defiLlamaId: 'echelon-market', // from https://defillama.com/docs/api
  website: 'https://app.echelon.market',
  twitter: 'https://twitter.com/EchelonMarket',
};

export const packageId =
  '0xc6bc659f1649553c1a3fa05d9727433dc03843baac29473c817d06d39e7621ba';
export const echelonLendingPackage = `${packageId}::lending::`;
export const echelonFarmingPackage = `${packageId}::farming::`;
export const marketKey = `markets`;
export const vaultType = `${echelonLendingPackage}Vault`;
export const stakerType = `${echelonFarmingPackage}Staker`;
export const marketType = `${echelonLendingPackage}Market`;
