import { Platform } from '@sonarwatch/portfolio-core';

export const zeusMint = 'ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq';
export const platformId = 'zeus';
export const platform: Platform = {
  id: platformId,
  name: 'Zeus',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/zeusnode.webp',
  website: 'https://app.zeusguardian.io/',
  twitter: 'https://x.com/ZeusNetworkHQ',
  documentation: 'https://docs.zeusnetwork.xyz/',
  tokens: [zeusMint],
  github: 'https://github.com/ZeusNetworkHQ',
  discord: 'https://discord.com/invite/zeusnetwork',
  medium: 'https://medium.com/@zeus-network',
  description: 'First Multichain Layer on Solana.',
};

export const programId = 'ZPLt7XEyRvRxEZcGFGnRKGLBymFjQbwmgTZhMAMfGAU';
