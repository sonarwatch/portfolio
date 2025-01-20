import {
  Contract,
  NetworkId,
  NetworkIdType,
  Platform,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Vault } from './structs';

export const platformId = 'defituna';
export const platform: Platform = {
  id: platformId,
  name: 'DefiTuna',
  image: 'https://sonar.watch/img/platforms/defituna.webp',
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
  network: NetworkId.solana,
};
const defiTunaServiceConfig = {
  networkId: NetworkId.solana,
  integratedOn: 1737381128000,
  contracts: [defiTunaContract],
};
export const defiTunaLendingService = {
  id: `${platformId}-lending`,
  name: 'Lending',
  platformId,
  configs: [defiTunaServiceConfig],
};
export const defiTunaLiquidityService = {
  id: `${platformId}-liquidity`,
  name: 'Liquidity Pools',
  platformId,
  configs: [defiTunaServiceConfig],
};
