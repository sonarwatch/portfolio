import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'fluxbeam';
export const platform: Platform = {
  id: platformId,
  name: 'Flux Beam',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/fluxbeam.webp',
  defiLlamaId: 'fluxbeam', // from https://defillama.com/docs/api
  website: 'https://fluxbeam.xyz/',
  description: 'Solana DEX, supporting innovation and Token-2022',
  twitter: 'https://x.com/FluxBeamDEX',
  discord: 'https://discord.com/invite/DtyqTx97kz',
  telegram: 'https://t.me/fluxbeam',
  documentation: 'https://docs.fluxbeam.xyz/',
  tokens: ['FLUXBmPhT3Fd1EDVFdg46YREqHBeNypn1h4EbnTzWERX'],
};
export const poolsCachePrefix = `${platformId}-pools`;
export const fluxbeamPoolsPid = 'FLUXubRmkEi2q6K3Y9kBPg9248ggaZVsoSFhtJHSrm1X';
