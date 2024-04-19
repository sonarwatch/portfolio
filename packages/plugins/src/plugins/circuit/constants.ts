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
export const jitoSOLMint = 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn';
export const prefixVaults = 'circuitVaults';
