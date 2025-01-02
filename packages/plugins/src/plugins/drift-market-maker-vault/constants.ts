import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const circuitPlatformId = 'circuit';
export const circuitPlatform: Platform = {
  id: circuitPlatformId,
  name: 'Circuit',
  image: 'https://sonar.watch/img/platforms/circuit.webp',
  website: 'https://app.circuit.trade/',
  twitter: 'https://twitter.com/CircuitTrading_',
};

export const moosePlatformId = 'moose';
export const moosePlatform: Platform = {
  id: moosePlatformId,
  name: 'Moose Market',
  image: 'https://sonar.watch/img/platforms/moose.webp',
  website: 'https://moose.market/',
  twitter: 'https://twitter.com/moose_market',
};

export const neutralPlatformId = 'neutral';
export const neutralPlatform: Platform = {
  id: neutralPlatformId,
  name: 'Neutral',
  image: 'https://sonar.watch/img/platforms/neutral.webp',
  website: 'https://www.app.neutral.trade/',
  twitter: 'https://twitter.com/TradeNeutral',
};

export const gauntletPlatformId = 'gauntlet';
export const gauntletPlatform: Platform = {
  id: gauntletPlatformId,
  name: 'Gauntlet',
  image: 'https://sonar.watch/img/platforms/gauntlet.webp',
  twitter: 'https://twitter.com/gauntlet_xyz',
  website:
    'https://app.drift.trade/vaults/CoHd9JpwfcA76XQGA4AYfnjvAtWKoBQ6eWBkFzR1A2ui',
};

export const vectisPlatformId = 'vectis';
export const vectisPlatform: Platform = {
  id: vectisPlatformId,
  name: 'Vectis',
  image: 'https://sonar.watch/img/platforms/vectis.webp',
  twitter: 'https://twitter.com/vectis_xyz',
  website: 'https://app.vectis.finance/',
};

export const hedgyPlatformId = 'hedgy';
export const hedgyPlatform: Platform = {
  id: hedgyPlatformId,
  name: 'Hedgy',
  image: 'https://sonar.watch/img/platforms/hedgy.webp',
  twitter: 'https://x.com/HedgyMarket',
  website: 'https://hedgy.market/',
};

export const vaultsPids = [
  new PublicKey('vAuLTsyrvSfZRuRB3XgvkPwNGgYSs9YRYymVebLKoxR'), // from Drift
  new PublicKey('9Fcn3Fd4d5ocrb12xCUtEvezxcjFEAyHBPfrZDiPt9Qj'), // from Neutral
  new PublicKey('EuSLjg23BrtwYAk1t4TFe5ArYSXCVXLBqrHRBfWQiTeJ'), // from Neutral
  new PublicKey('BVddkVtFJLCihbVrtLo8e3iEd9NftuLunaznAxFFW8vf'), // from Neutral
];

export const prefixVaults = 'circuitVaults';

// For each vault, find the Manager of the vault and put the pubkey here along with it's platform.
export const platformIdByVaultManager: Map<string, string> = new Map([
  ['GT3RSBy5nS2ACpT3LCkycHWm9CVJCSuqErAgf4sE33Qu', circuitPlatformId],
  ['En8nqJqCE9D2Bsqetw4p89VgZTh8QK8SfCAn5sSyL4PM', moosePlatformId],
  ['C77bxLHWjnAVeG9HdMxu1gunFnjRCcWUDZYfa7xbacHr', neutralPlatformId],
  ['neutBqYtHqPiu89Yfuk3X3cebgBtyppzSbxJ9tt1eSB', neutralPlatformId],
  ['G6L1NE8tLYYzvMHYHbkHZqPFvfEsiRAsHSvyNQ2hut3o', gauntletPlatformId],
  ['HG5SYPLJuD9xT2vdGBwzCoYCVfVs2jJFtc8BLt1J6nY8', hedgyPlatformId],
  ['86fYXDydyKKnL7gxWpVrUDnsrVyQyZkwb4YsisBHC9ab', gauntletPlatformId],
  ['6HmPq4hU2BQqkogVuohggZwaqNFQRpRQ6MSE6bcKxCEa', vectisPlatformId],
]);
