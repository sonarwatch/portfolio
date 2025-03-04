import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'superposition';
export const platform: Platform = {
  id: platformId,
  name: 'Superposition',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/superposition.webp',
  website: 'https://www.superposition.finance/',
  twitter: 'https://x.com/superpositionfi',
  defiLlamaId: 'superposition', // from https://defillama.com/docs/api
};
export const marketsCacheKey = `markets`;

export const packageId =
  '0xccd1a84ccea93531d7f165b90134aa0415feb30e8757ab1632dac68c0055f5c2';
export const portfolioType = `${packageId}::portfolio::Portfolio`;
export const collateralPositionType = `${packageId}::portfolio::PositionView`;
export const liabilityPositionType = `${packageId}::portfolio::SupplyPosition`;
