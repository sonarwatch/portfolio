import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { VaultInfo } from './types';
import { usdcSolanaMint } from '../../utils/solana';

export const platformId = 'circuit';
export const platform: Platform = {
  id: platformId,
  name: 'Circuit',
  image: 'https://sonar.watch/img/platforms/circuit.png',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://app.circuit.trade/',
  twitter: 'https://twitter.com/CircuitTrading_',
};

export const circuitPid = new PublicKey(
  'vAuLTsyrvSfZRuRB3XgvkPwNGgYSs9YRYymVebLKoxR'
);
export const jitoSOLMint = 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn';
export const vaultKey = 'vaults';

export const nameOfVauilts: Map<string, VaultInfo> = new Map([
  [
    'F3no8aqNZRSkxvMEARC4feHJfvvrST2ZrHzr2NBVyJUr',
    { name: 'Turbocharger', mint: usdcSolanaMint, decimals: 6 },
  ],
  [
    'GXyE3Snk3pPYX4Nz9QRVBrnBfbJRTAQYxuy5DRdnebAn',
    { name: 'Supercharger', mint: usdcSolanaMint, decimals: 6 },
  ],
  [
    'ACmnVY5gf1z9UGhzBgnr2bf3h2ZwXW2EDW1w8RC9cQk4',
    { name: 'JitoSol Basis', mint: jitoSOLMint, decimals: 9 },
  ],
]);
