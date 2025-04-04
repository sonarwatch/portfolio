import { NetworkId } from '@sonarwatch/portfolio-core';
import { Address } from 'viem';

export const platformId = 'eigenlayer';
export const platform = {
  id: platformId,
  name: 'Eigenlayer',
};

export const chain = NetworkId.ethereum;

export const eigenTokenAddress: Address =
  '0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83';

// EigenPodManager address : https://github.com/Layr-Labs/eigenlayer-contracts/blob/dev/README.md
export const eigenPodManagerAddress: Address =
  '0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338';

export const bEigenTokenAddress: Address =
  '0x83E9115d334D248Ce39a6f36144aEaB5b3456e75';

export const cacheKey = {
  strategies: 'eigenlayer-strategies',
  withdrawals: 'eigenlayer-withdrawals',
  depositPositions: 'eigenlayer-deposit-positions',
};
