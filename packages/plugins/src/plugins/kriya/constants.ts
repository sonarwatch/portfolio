import { Platform } from '@sonarwatch/portfolio-core';
import { VaultInfo } from './types';

export const platformId = 'kriya';
export const platform: Platform = {
  id: platformId,
  name: 'Kriya',
  image: 'https://sonar.watch/img/platforms/kriya.webp',
  defiLlamaId: 'kriya-swap', // from https://defillama.com/docs/api
  website: 'https://www.app.kriya.finance/',
  twitter: 'https://twitter.com/KriyaDEX',
};

export const vaultsPackageId =
  '0xc4ee7b00ea981402a6285b14ffa5dcd1ee7f97eb2a91df3bcc04fa88c56ac7d7';
export const farmsPackageId =
  '0x88701243d0445aa38c0a13f02a9af49a58092dfadb93af9754edb41c52f40085';

export const vaultsInfoKey = 'vaultsInfos';
export const leverageVaultsInfoKey = 'leverageVaultsInfos';
export const farmsInfoKey = 'farmsInfos';

export const vaultsUrl =
  'https://88ob93rfva.execute-api.ap-southeast-1.amazonaws.com/release/vaults';
export const poolsUrl =
  'https://xd0ljetd33.execute-api.ap-southeast-1.amazonaws.com/release/pools';
export const leverageVaultsUrl =
  'https://4sacq88271.execute-api.ap-southeast-1.amazonaws.com/release/vaults';

export const vaultsCointsTypes = [
  '0xc4ee7b00ea981402a6285b14ffa5dcd1ee7f97eb2a91df3bcc04fa88c56ac7d7::kc_allweather_vt::KC_ALLWEATHER_VT',
];

export const vaultsInfo: VaultInfo[] = [
  {
    tokenType:
      '0xc4ee7b00ea981402a6285b14ffa5dcd1ee7f97eb2a91df3bcc04fa88c56ac7d7::kc_allweather_vt::KC_ALLWEATHER_VT',
    id: '0x5eb2f7e07e4fbe6ce47dd10dc040efd5c79228ed767d242c320571dcd7c5a976',
    underlyingPool:
      '0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630',
  },
  {
    tokenType:
      '0x1e06cc1e491b434cd1be9f24e1f8a82f6fcb016f6fb87f0586b0fe57ecca6cbb::kc_navx_chopper_vt::KC_NAVX_CHOPPER_VT',
    id: '0xce23eccbba8e6fe0351a8d6e2f736929723ef0ada2ca9d3612557ac6bc423c87',
    underlyingPool:
      '0x0254747f5ca059a1972cd7f6016485d51392a3fde608107b93bbaebea550f703',
  },
  {
    tokenType:
      '0x6d8c1becd365aaa5474a0642247b15189e1625f32104945749f1e8802b768d6d::kc_degen_vt::KC_DEGEN_VT',
    id: '0x264c3b7de2abf0df2871bc0486bfab001f88b76c865bbdda377cd583b633c17a',
    underlyingPool:
      '0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630',
  },
];

export const dynamicFieldPositionType =
  '0x2::dynamic_field::Field<vector<u8>, 0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::position::Position>';
