import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { PublicKey } from '@solana/web3.js';
import { NxfinanceLeverageIDL } from './idl';

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

export const nxfinanceLeverageIdlItem = {
  programId: leverageFiProgramID.toString(),
  idl: NxfinanceLeverageIDL,
  idlType: 'anchor',
} as IdlItem;
