import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'fraxlend';
export const platform: Platform = {
  id: platformId,
  name: 'Fraxlend',
  image: 'https://icons.llama.fi/frax.jpg',
  defiLlamaId: 'parent#frax-finance', // from https://defillama.com/docs/api
  website: 'https://app.frax.finance/fraxlend/available-pairs',
};

export const fraxtalPoolRegistry = '0x4C3B0e85CD8C12E049E07D9a4d68C441196E6a12';

export const pairAddressesCachePrefix = `${platformId}-pair-addresses`;
