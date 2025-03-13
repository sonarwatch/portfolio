import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { AllbridgeIDL } from './idl';

export const platformId = 'allbridge';
export const platform: Platform = {
  id: platformId,
  name: 'Allbridge',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/allbridge.webp',
  website: 'https://core.allbridge.io/pools',
  twitter: 'https://twitter.com/Allbridge_io',
  defiLlamaId: 'allbridge-core', // from https://defillama.com/docs/api
  discord: 'https://discord.com/invite/ASuPY8d3E6',
  description:
    'Allbridge is a cross-chain bridge that enables seamless asset transfers between different blockchains.',
  documentation: 'https://docs-core.allbridge.io/',
  github: 'https://github.com/allbridge-io',
  medium: 'https://allbridge.medium.com/',
  telegram: 'https://t.me/allbridge_official',
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
