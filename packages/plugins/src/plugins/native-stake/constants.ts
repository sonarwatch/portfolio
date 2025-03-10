import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'native-stake';
export const nativeStakePlatform: Platform = {
  id: platformId,
  name: 'Validators',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/native-stake.webp',
};
export const validatorsKey = 'activeValidators';
export const validatorsPrefix = `${platformId}-validators`;
