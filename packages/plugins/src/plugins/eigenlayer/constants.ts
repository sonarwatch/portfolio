import { Platform } from '@sonarwatch/portfolio-core';
import { Contract } from './types';

export const platformId = 'eigenlayer';
export const platform: Platform = {
  id: platformId,
  name: 'Eigenlayer',
};

export const poolManager: Contract = {
  chain: 'ethereum',
  address: '0x858646372CC42E1A627fcE94aa7A7033e7CF075A',
};

export const chain = 'ethereum';

export const strategyFactory: Contract = {
  chain: 'ethereum',
  address: '0x5e4c39ad7a3e881585e383db9827eb4811f6f647',
};

export const strategyManager: Contract = {
  chain: 'ethereum',
  address: '0x858646372CC42E1A627fcE94aa7A7033e7CF075A ',
};

export const poolAddresses: `0x${string}`[] = [
  '0x93c4b944d05dfe6df7645a86cd2206016c51564d',
  '0x0fe4f44bee93503346a3ac9ee5a26b130a5796d6',
  '0x1bee69b7dfffa4e2d53c2a2df135c388ad25dcd2',
  '0x9d7ed45ee2e8fc5482fa2428f15c971e6369011d',
  '0x54945180db7943c0ed0fee7edab2bd24620256bc',
  '0x57ba429517c3473b6d34ca9acd56c0e735b94c02',
  '0xa4c637e0f704745d182e4d38cab7e7485321d059',
  '0x7ca911e83dabf90c90dd3de5411a10f1a6112184',
  '0x13760f50a9d7377e4f20cb8cf9e4c26586c658ff',
  '0x298afb19a105d59e74658c4c334ff360bade6dd2',
  '0x8ca7a5d6f3acd3a7a8bc468a8cd0fb14b6bd28b6',
  '0xae60d8180437b5c34bb956822ac2710972584473',
];
