import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'fraxlend';
export const platform: Platform = {
  id: platformId,
  name: 'Fraxlend',
  image: 'https://icons.llama.fi/frax.jpg',
  defiLlamaId: 'parent#frax-finance', // from https://defillama.com/docs/api
  website: 'https://app.frax.finance/fraxlend/available-pairs',
};
