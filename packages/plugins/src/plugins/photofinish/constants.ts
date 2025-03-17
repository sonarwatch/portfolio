import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'photofinish';
export const crownMint = 'GDfnEsia2WLAW5t8yx2X5j2mkfA74i5kwGdDuZHt7XmG';
export const platform: Platform = {
  id: platformId,
  name: 'Photo Finish',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/photofinish.webp',
  website: 'https://photofinish.live/',
  twitter: 'https://x.com/photofinishgame',
  discord: 'https://discord.com/invite/AsEMTAnJaS',
  tokens: [crownMint],
  description:
    'Experience the thrill of owning a race horse without any of the hassle.',
};

export const apiUrl =
  'https://api.photofinish.live/users/external/staked-crown/';
