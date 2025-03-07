import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'aries';
export const platform: Platform = {
  id: platformId,
  name: 'Aries',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/aries.webp',
  defiLlamaId: 'aries-markets',
  website: 'https://app.ariesmarkets.xyz/',
  twitter: 'https://twitter.com/AriesMarkets',
};

export const packageId =
  '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3';
export const profilesSummaryType = `${packageId}::profile::Profiles`;
export const profileType = `${packageId}::profile::Profile`;

export const reserveApiUrl = 'https://api-v2.ariesmarkets.xyz/reserve.current';
export const reservesKey = 'reserves';
export const wadsDecimal = 18;
