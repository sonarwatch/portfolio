import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { elementalIDLs } from './elementalVaultIDL';

export const platformId = 'elemental';
export const platform: Platform = {
  id: platformId,
  name: 'Elemental',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/elemental.webp',
  website: 'https://elemental.fund/',
  twitter: 'https://twitter.com/elementaldefi',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};
export const poolsCacheKey = `pools`;

export const elementalIdlItem = {
  programId: elementalIDLs.address,
  idl: elementalIDLs,
  idlType: 'anchor',
} as IdlItem;
