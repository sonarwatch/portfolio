import { Platform, suiNativeAddress } from '@sonarwatch/portfolio-core';

export const platformId = 'jewel-swap';
export const platform: Platform = {
  id: platformId,
  name: 'Jewel Swap',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/jewel.webp',
  website: 'https://sui.jewelswap.io/',
  defiLlamaId: 'parent#jewelswap',
  twitter: 'https://twitter.com/JewelSwapX',
};
export const marketsCachePrefix = `${platformId}-markets`;

export const jwlSui =
  '0x2921ca2fe6ee99698b095f046bc9759ce7a764d2e91ab0ad182c143649c3df79::jwlsui::JWLSUI';
export const suiUserInfosParentId =
  '0xcf75f09267573f3723c8b36fd99b88659039980d34e73c3e267ca3eff52ee313';

export const scaUserInfosParentid =
  '0xe33921e7069d7bffa01188aca3594cd3bbbdfe8344e704cdf16cf5f46a046d4a';

export const cetusUserInfosParentid =
  '0xbdb8742b0c3e31aef61997faef504a1160158951546d69fc0d329c6272c42a91';

export const stakedAssetInfos = [
  {
    asset:
      '0x0e25582daef54ee41052390c4db5e70a82ec1baed97942db0eb6094267624b5d::jwlsca::JWLSCA',
    underlying:
      '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
    parentId:
      '0xe33921e7069d7bffa01188aca3594cd3bbbdfe8344e704cdf16cf5f46a046d4a',
  },
  {
    asset: jwlSui,
    underlying: suiNativeAddress,
    parentId:
      '0xcf75f09267573f3723c8b36fd99b88659039980d34e73c3e267ca3eff52ee313',
  },
  {
    asset:
      '0x0e25582daef54ee41052390c4db5e70a82ec1baed97942db0eb6094267624b5d::jwlcetus::JWLCETUS',
    underlying:
      '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
    parentId:
      '0xbdb8742b0c3e31aef61997faef504a1160158951546d69fc0d329c6272c42a91',
  },
];
