import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'aptin';
export const platform: Platform = {
  id: platformId,
  name: 'Aptin',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/aptin.webp',
  defiLlamaId: 'aptin-finance-v2', // from https://defillama.com/docs/api
  website: 'https://app.aptin.io/',
  twitter: 'https://twitter.com/aptinlabs',
};

export const packageId =
  '0x3c1d4a86594d681ff7e5d5a233965daeabdc6a15fe5672ceeda5260038857183';
export const configStoresKey = 'configStores';
export const poolPositionsType = `${packageId}::pool::Positions`;
export const borrowPositionType = `${packageId}::pool::BorrowPosition`;
export const supplyPositionType = `${packageId}::pool::SupplyPosition`;
