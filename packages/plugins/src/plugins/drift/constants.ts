import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'drift';
export const platformName = 'Drift';
export const platformImage = 'https://sonar.watch/img/platforms/drift.webp';
export const platformWebsite = 'https://www.drift.trade/';
export const platform: Platform = {
  id: platformId,
  name: platformName,
  image: platformImage,
  defiLlamaId: 'parent#drift',
  website: platformWebsite,
};
export const keySpotMarkets = `spotMarkets`;

export const driftProgram = new PublicKey(
  'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH'
);

export const preMarketPriceKey = 'premarketPrice';
export const perpMarketsIndexesKey = 'perp-markets-indexes';
export const oracleToMintKey = 'oracle-to-mint';

export const airdropUrl = 'https://airdrop.drift.trade/eligibility/';
export const driftDecimals = 6;
export const driftMint = 'DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7';

export const airdropStatics: AirdropStatics = {
  id: 'drift-airdrop-1',
  claimLink: 'https://drift.foundation',
  image: platformImage,
  name: undefined,
  emitterName: platformName,
  emitterLink: platformWebsite,
  claimStart: 1715860800000,
  claimEnd: 1723831200000,
};
