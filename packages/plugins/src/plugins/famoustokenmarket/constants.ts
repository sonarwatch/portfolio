import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { PublicKey } from '@solana/web3.js';
import { FamousTokenMarketIDL } from './idl';

export const platformId = 'famoustokenmarket';

export const platform: Platform = {
  id: platformId,
  name: 'Famous Token Market',
  image: 'https://sonar.watch/img/platforms/foo.webp',
  website: 'https://famousfoxes.com/tokenmarket',
  twitter: 'https://twitter.com/famousfoxfed',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};

export const famousTokenMarketProgram = new PublicKey(
  '8BYmYs3zsBhftNELJdiKsCN2WyCBbrTwXd6WG4AFPr6n'
);

export const famousTokenMarketIdlItem = {
  programId: famousTokenMarketProgram.toString(),
  idl: FamousTokenMarketIDL,
  idlType: 'anchor',
} as IdlItem;
