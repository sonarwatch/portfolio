import { PublicKey } from '@solana/web3.js';

export const platformId = 'native-stake';
export const validatorsKey = 'activeValidators';
export const validatorsPrefix = `${platformId}-validators`;
export const marinadeNativeManager = new PublicKey(
  'noMa7dN4cHQLV4ZonXrC29HTKFpxrpFbDLK5Gub8W8t'
);

export const marinadeNativeMerger = new PublicKey(
  'noMa7dN4cHQLV4ZonXrC29HTKFpxrpFbDLK5Gub8W8t'
);
