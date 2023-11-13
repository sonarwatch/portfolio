import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'fluxbeam';
export const platform: Platform = {
  id: platformId,
  name: 'Flux Beam',
  image: 'https://sonar.watch/img/platforms/fluxbeam.png',
  defiLlamaId: 'fluxbeam', // from https://defillama.com/docs/api
  website: 'https://fluxbeam.xyz/',
};
export const poolsCachePrefix = `${platformId}-pools`;
export const fluxbeamPoolsPid = 'FLUXubRmkEi2q6K3Y9kBPg9248ggaZVsoSFhtJHSrm1X';
