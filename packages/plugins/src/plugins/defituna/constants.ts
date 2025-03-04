import { NetworkId, Platform, Service } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Vault } from './structs';

export const platformId = 'defituna';
export const platform: Platform = {
  id: platformId,
  name: 'DefiTuna',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/defituna.webp',
  website: 'https://defituna.com',
  twitter: 'https://x.com/DeFiTuna',
};

export const defiTunaProgram = new PublicKey(
  'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD'
);

export const lendingPoolsCacheKey = 'lending-pools';
export const poolsMemo = new MemoizedCache<Vault[]>(lendingPoolsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const defiTunaContract = {
  name: 'DefiTuna',
  address: defiTunaProgram.toString(),
};

export const defiTunaService: Service = {
  id: `${platformId}`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [defiTunaContract],
};
