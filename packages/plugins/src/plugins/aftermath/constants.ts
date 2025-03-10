import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'aftermath';

export const platform: Platform = {
  id: platformId,
  name: 'Aftermath',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/aftermath.webp',
  defiLlamaId: 'parent#aftermath-finance',
  website: 'https://aftermath.finance/',
};

export const lpCoinsTable =
  '0x7f3bb65251feccacc7f48461239be1008233b85594114f7bf304e5e5b340bf59';
export const stakingPackageId =
  '0x4f0a1a923dd063757fd37e04a9c2cee8980008e94433c9075c390065f98e9e4b';

export const stakingType = `${stakingPackageId}::staked_position::StakedPosition`;
