import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'benqi';
export const banqPlatform: Platform = {
  id: platformId,
  name: 'Benqi',
  image: 'https://sonar.watch/img/platforms/benqi.png',
  defiLlamaId: 'benqi-lending', // from https://defillama.com/docs/api
  website: 'https://benqi.fi/',
  twitter: 'https://twitter.com/BenqiFinance',
};

export const comptroller = '0x486Af39519B4Dc9a7fCcd318217352830E8AD9b4';
