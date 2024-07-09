import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { AllbridgeIDL } from './idl';

export const platformId = 'allbridge';
export const platform: Platform = {
  id: platformId,
  name: 'Allbridge',
  image: 'https://sonar.watch/img/platforms/allbridge.webp',
  website: 'https://core.allbridge.io/pools',
  twitter: 'https://twitter.com/Allbridge_io',
  defiLlamaId: 'allbridge-core', // from https://defillama.com/docs/api
};

export const apiPoolInfoUrl = `https://core.api.allbridgecoreapi.net/token-info`;

export const poolsCacheKey = `${platformId}-pools`;
export const cachePrefix = `${platformId}`;

export const allbridgeProgram = new PublicKey(
  'BrdgN2RPzEMWF96ZbnnJaUtQDQx7VRXYaHHbYCBvceWB'
);

export const SYSTEM_PRECISION = 3;

export const allbridgeIdlItem = {
  programId: allbridgeProgram.toString(),
  idl: AllbridgeIDL,
  idlType: 'anchor',
} as IdlItem;
