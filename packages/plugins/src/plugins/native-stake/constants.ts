import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'native-stake';
export const nativeStakePlatform: Platform = {
  id: platformId,
  name: 'Native Stake',
  image: 'https://sonar.watch/img/platforms/native-stake.png',
};
export const validatorsKey = 'activeValidators';
export const validatorsPrefix = `${platformId}-validators`;
export const marinadeNativeManager = new PublicKey(
  'noMa7dN4cHQLV4ZonXrC29HTKFpxrpFbDLK5Gub8W8t'
);

export const marinadeNativeMerger = new PublicKey(
  'noMa7dN4cHQLV4ZonXrC29HTKFpxrpFbDLK5Gub8W8t'
);
