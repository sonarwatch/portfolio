import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'maker';
export const platform: Platform = {
  id: platformId,
  name: 'Maker DAO',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/maker.webp',
  defiLlamaId: 'makerdao',
  website: 'https://makerdao.com/',
};

export const ilksPrefix = `${platformId}-ilks`;
export const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
export const daiDecimals = 18;
export const sDaiAddress = '0x83F20F44975D03b1b09e64809B757c47f942BEeA';
export const sDaiDecimals = 18;
export const chaiAddress = '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215';
export const chaiDecimals = 18;
export const potAddress = '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7';
export const proxyRegAddress = '0x4678f0a6958e4d2bc4f1baf7bc52e8f3564f3fe4';
export const cdpManagerAddress = '0x5ef30b9986345249bc32d8928b7ee64de9435e39';
export const vatAddress = '0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b';
export const ilkRegAddress = '0x5a464c28d19848f44199d003bef5ecc87d090f87';
