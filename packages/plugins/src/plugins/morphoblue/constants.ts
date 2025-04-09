import { NetworkId } from '@sonarwatch/portfolio-core';
import { Address } from 'viem';

export const platformId = 'morphoblue';

export const morphoApiUrl = 'https://blue-api.morpho.org/graphql';
export const morphoRewardsApiUrl = 'https://rewards.morpho.org/v1';

export const morphoMarketsCachePrefix = `${platformId}-markets`;
export const morphoVaultsCachePrefix = `${platformId}-vaults`;

export type MorphoNetworkIdType = typeof NetworkId.ethereum;

export const networkIdToMorphoContract: Record<MorphoNetworkIdType, Address> = {
  [NetworkId.ethereum]: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
};
