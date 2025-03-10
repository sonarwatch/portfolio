import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'suins';
export const platform: Platform = {
  id: platformId,
  name: 'Sui Name Service',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/suins.webp',
  website: 'https://suins.io/',
  twitter: 'https://x.com/suinsdapp',
  defiLlamaId: 'suins', // from https://defillama.com/docs/api
};
export const airdropStatics: AirdropStatics = {
  claimLink: 'https://claim.suins.io/',
  emitterLink: 'https://token.suins.io/',
  emitterName: 'Sui NS',
  id: `${platformId}-token-launch`,
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/suins.webp',
  claimEnd: undefined,
  claimStart: 1731582000000,
};

export const nsMint =
  '0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS';
export const nsDecimals = 6;
