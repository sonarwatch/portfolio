import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { PublicKey } from '@solana/web3.js';
import { StakingIDL } from './stakingIdl';
import { tokenMarketIdl } from './tokenMarketIdl';

export const platformId = 'famousfoxfederation';

export const foxyMint = 'FoXyMu5xwXre7zEoSvzViRk3nGawHUp9kUh97y2NDhcq';
export const platform: Platform = {
  id: platformId,
  name: 'Famous Fox Federation',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/famousfoxfederation.webp',
  website: 'https://famousfoxes.com',
  twitter: 'https://twitter.com/famousfoxfed',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  discord: 'https://discord.com/invite/famousfoxes',
  tokens: [foxyMint],
};

export const tokenMarketProgram = new PublicKey(
  '8BYmYs3zsBhftNELJdiKsCN2WyCBbrTwXd6WG4AFPr6n'
);

export const tokenMarketIdlItem = {
  programId: tokenMarketProgram.toString(),
  idl: tokenMarketIdl,
  idlType: 'anchor',
} as IdlItem;

export const foxProgram = new PublicKey(
  'FoXpJL1exLBJgHVvdSHNKyKu2xX2uatctH9qp6dLmfpP'
);
export const stakingConfigAccount = new PublicKey(
  '7N7M1H2CK51ip7sNtPgKhhv2eScx6BokLgHi1Ke3ZLiq'
);

export const stakingIdlItem = {
  programId: foxProgram.toString(),
  idl: StakingIDL,
  idlType: 'anchor',
} as IdlItem;

export const cachePrefix = 'famousfoxfederation';
export const stakingConfigCacheKey = 'stakingconfig';
