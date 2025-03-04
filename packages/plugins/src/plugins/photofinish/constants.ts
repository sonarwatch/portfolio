import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'photofinish';
export const platform: Platform = {
  id: platformId,
  name: 'Photo Finish',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/photofinish.webp',
  website: 'https://photofinish.live/',
  twitter: 'https://x.com/photofinishgame',
};

export const apiUrl =
  'https://api.photofinish.live/users/external/staked-crown/';
export const crownMint = 'GDfnEsia2WLAW5t8yx2X5j2mkfA74i5kwGdDuZHt7XmG';
