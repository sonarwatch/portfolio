import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { PublicKey } from '@solana/web3.js';
import { NxfinanceLeverageIDL } from './leverageIdl';
import { NxfinanceLendIdl } from './lendIdl';

export const platformId = 'nxfinance';
export const platform: Platform = {
  id: platformId,
  name: 'NX Finance',
  image: 'https://sonar.watch/img/platforms/nxfinance.webp',
  website: 'https://nxfinance.io/',
  twitter: 'https://twitter.com/NX_Finance',
  defiLlamaId: 'nx-finance', // from https://defillama.com/docs/api
};

export const ID = new PublicKey('RaXcyfW8jK295UAU1XN2uLMTHnTWEaeCcNWLeDB4iD6');

export const leverageFiProgramID = new PublicKey(
  'EHBN9YKtMmrZhj8JZqyBQRGqyyeHw5xUB1Q5eAHszuMt'
);

export const leverageVaultsMints = [
  '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4', // JLP
  'jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v', // JupSOL
  'vSoLxydx6akxyMD9XEcPvGYNGq6Nn66oqVb3UkGkei7', // vSOL
  'sSo14endRuUbvQaJS3dq36Q829a3A6BEfoeeRGJywEh', // sSOL
];

export const nxfinanceLeverageIdlItem = {
  programId: leverageFiProgramID.toString(),
  idl: NxfinanceLeverageIDL,
  idlType: 'anchor',
} as IdlItem;

export const lendProgramId = new PublicKey(
  'NXFiKimQN3QSL3CDhCXddyVmLfrai8HK36bHKaAzK7g'
);

export const nxfinanceLendIdlItem = {
  programId: lendProgramId.toString(),
  idl: NxfinanceLendIdl,
  idlType: 'anchor',
} as IdlItem;

export const lendingPoolKey = 'lending-pools';

export const lendingPools = [
  new PublicKey('HVn3F2wq2Fvr8T5yX7VS9yWaNxX5PMgxTyHb4aKAX8z3'),
];
