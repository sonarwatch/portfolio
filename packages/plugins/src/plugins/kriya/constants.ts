import { Platform } from '@sonarwatch/portfolio-core';
import { VaultInfo } from './types';

export const platformId = 'kriya';
export const platform: Platform = {
  id: platformId,
  name: 'Kriya',
  image: 'https://sonar.watch/img/platforms/kriya.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  // website: 'https://myplatform.com',
  // twitter: 'https://twitter.com/myplatform',
};

export const vaultsPackageId =
  '0xc4ee7b00ea981402a6285b14ffa5dcd1ee7f97eb2a91df3bcc04fa88c56ac7d7';
export const farmsPackageId =
  '0x88701243d0445aa38c0a13f02a9af49a58092dfadb93af9754edb41c52f40085';

export const vaultsInfoKey = 'vaultsInfos';
export const farmsInfoKey = 'farmsInfos';

export const vaultsUrl =
  'https://88ob93rfva.execute-api.ap-southeast-1.amazonaws.com/release/vaults';
export const poolsUrl =
  'https://xd0ljetd33.execute-api.ap-southeast-1.amazonaws.com/release/pools';

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
];

export const dynamicFieldPositionType =
  '0x2::dynamic_field::Field<vector<u8>, 0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::position::Position>';
