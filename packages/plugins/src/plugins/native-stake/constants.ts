import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'native-stake';
export const nativeStakePlatform: Platform = {
  id: platformId,
  name: 'Native Stake',
  image: 'https://sonar.watch/img/platforms/native-stake.webp',
};
export const validatorsKey = 'activeValidators';
export const validatorsPrefix = `${platformId}-validators`;
