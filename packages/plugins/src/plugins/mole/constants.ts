import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'mole';
export const platform: Platform = {
  id: platformId,
  name: 'Mole',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/mole.webp',
  defiLlamaId: 'mole', // from https://defillama.com/docs/api
  website: 'https://app.mole.fi/',
  twitter: 'https://twitter.com/moledefi',
};

export const magicCoin =
  '0x5ffa69ee4ee14d899dcc750df92de12bad4bacf81efa1ae12ee76406804dda7f::vault::MagicCoin';
export const suiStackedParentId =
  '0x02acbf5d6e48bced367c43ca121da29c05fd9a207c0d8aa4552d553f189e6700';
export const usdcStackedParentId =
  '0x81b17a30ed130e0d1f400678f07cf07578e3ee31c7d208656d71cfd56ac0fe94';
export const suiIncentiveUserType =
  '0x2f73c04ded344fd4e2530ec8012a7cffdc17cbb049559f3196c030f58c3a0cdd::sui_incentive::User';

export const stackedSavingsParentIds = [
  suiStackedParentId,
  usdcStackedParentId,
];

export const dataUrl = `https://app.mole.fi/api/SuiMainnet/data.json`;

export const vaultsPrefix = `${platformId}`;
export const dataKey = 'data';
export const positionsKey = 'positions';
