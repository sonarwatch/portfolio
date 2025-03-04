import { Platform } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

export const platformId = 'rocketpool';
export const platform: Platform = {
  id: platformId,
  name: 'Rocket Pool',
  defiLlamaId: 'rocket-pool',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/rocketpool.webp',
  website: 'https://rocketpool.net/',
};
export const marketsCachePrefix = `${platformId}-markets`;
export const minipoolManagerAddress =
  '0x6293B8abC1F36aFB22406Be5f96D893072A8cF3a';
export const nodeStakingAddress = '0x0d8D8f8541B12A0e1194B7CC4b6D954b90AB82ec';
export const rplAddress = '0xD33526068D116cE69F19A9ee46F0bd304F21A51f';
export const rplDecimals = 18;
export const rplFactor = new BigNumber(10 ** rplDecimals);
