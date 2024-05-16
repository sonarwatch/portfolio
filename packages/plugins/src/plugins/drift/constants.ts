import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'drift';
export const platformName = 'Drift';
export const platformImage = 'https://sonar.watch/img/platforms/drift.png';
export const platformWebsite = 'https://www.drift.trade/';
export const platform: Platform = {
  id: platformId,
  name: platformName,
  image: platformImage,
  defiLlamaId: 'drift',
  website: platformWebsite,
};
export const prefixSpotMarkets = `${platformId}-spotMarkets`;

export const driftProgram = new PublicKey(
  'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH'
);

export const preMarketPriceKey = 'premarketPrice';

export const airdropUrl = 'https://airdrop.drift.trade/eligibility/';
export const distributorPid = 'E7HtfkEMhmn9uwL7EFNydcXBWy5WCYN1vFmKKjipEH1x';
export const driftDecimals = 6;
export const driftMint = undefined;
