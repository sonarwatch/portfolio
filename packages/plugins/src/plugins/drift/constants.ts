import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'drift';
export const driftPlatform: Platform = {
  id: platformId,
  name: 'Drift',
  image: 'https://sonar.watch/img/platforms/drift.png',
  defiLlamaId: 'drift',
};
export const prefixSpotMarkets = `${platformId}-spotMarkets`;

export const DriftProgram = new PublicKey(
  'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH'
);
