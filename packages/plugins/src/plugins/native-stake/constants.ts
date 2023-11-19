import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'native-stake';
export const nativeStakePlatform: Platform = {
  id: platformId,
  name: 'Native Stake',
  image: 'https://sonar.watch/img/platforms/native-stake.png',
};
export const validatorsKey = 'activeValidators';
export const validatorsPrefix = `${platformId}-validators`;

export const marinadeNativeManagerAddresses = [
  'stWirqFCf2Uts1JBL1Jsd3r6VBWhgnpdPxCTe1MFjrq',
  'noMa7dN4cHQLV4ZonXrC29HTKFpxrpFbDLK5Gub8W8t',
  'noMa7dN4cHQLV4ZonXrC29HTKFpxrpFbDLK5Gub8W8t',
];
