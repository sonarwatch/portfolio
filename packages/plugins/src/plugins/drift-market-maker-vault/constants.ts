import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const circuitPlatformId = 'circuit';
export const circuitPlatform: Platform = {
  id: circuitPlatformId,
  name: 'Circuit',
  image: 'https://sonar.watch/img/platforms/circuit.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://app.circuit.trade/',
  twitter: 'https://twitter.com/CircuitTrading_',
};

export const moosePlatformId = 'moose';
export const moosePlatform: Platform = {
  id: moosePlatformId,
  name: 'Moose Market',
  image: 'https://sonar.watch/img/platforms/moose.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://moose.market/',
  twitter: 'https://twitter.com/moose_market',
};

export const vaultsPid = new PublicKey(
  'vAuLTsyrvSfZRuRB3XgvkPwNGgYSs9YRYymVebLKoxR'
);
export const prefixVaults = 'circuitVaults';

export const platformIdByVaultManager: Map<string, string> = new Map([
  ['GT3RSBy5nS2ACpT3LCkycHWm9CVJCSuqErAgf4sE33Qu', circuitPlatformId],
  ['En8nqJqCE9D2Bsqetw4p89VgZTh8QK8SfCAn5sSyL4PM', moosePlatformId],
]);
