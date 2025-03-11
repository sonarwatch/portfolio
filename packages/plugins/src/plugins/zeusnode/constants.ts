import { Contract, Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'zeusnode';
export const platform: Platform = {
  id: platformId,
  name: 'ZeusNode',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/zeusnode.webp',
  website: 'https://app.zeusguardian.io/',
};

export const zeusNodeDelegateContract: Contract = {
  name: `${platform.name} Delegate`,
  address: 'ZPLt7XEyRvRxEZcGFGnRKGLBymFjQbwmgTZhMAMfGAU',
};

export const zeusMint = 'ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq';
