import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'convex';
export const platform: Platform = {
  id: platformId,
  name: 'Convex',
  image: 'https://icons.llama.fi/convex-finance.jpg',
  defiLlamaId: 'convex-finance', // from https://defillama.com/docs/api
  website: 'https://www.convexfinance.com/',
};

export const stakedCvxFXSAddress = '0x8c279F6Bfa31c47F29e5d05a68796f2A6c216892';
export const wFXBAddress = '0x8301A2C86615Edf08d8980ECCca8287322423390';
