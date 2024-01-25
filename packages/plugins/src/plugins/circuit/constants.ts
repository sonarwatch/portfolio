import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

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

export const vaultKey = 'vaults';

export const nameOfVauilts = new Map([
  ['F3no8aqNZRSkxvMEARC4feHJfvvrST2ZrHzr2NBVyJUr', 'Turbocharger Vault'],
  ['GXyE3Snk3pPYX4Nz9QRVBrnBfbJRTAQYxuy5DRdnebAn', 'Supercharger'],
]);
