import { PublicKey } from '@solana/web3.js';
import { tensorPlatform } from '../../platforms';

export const platformId = tensorPlatform.id;
export const cachePrefix = 'tensor';

export const tensorProgram = new PublicKey(
  'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'
);
