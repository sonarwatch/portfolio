import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'navi';
export const platform: Platform = {
  id: platformId,
  name: 'NAVI',
  image: `https://sonar.watch/img/platforms/${platformId}.webp`,
  defiLlamaId: 'parent#navi-protocol',
  website: 'https://www.naviprotocol.io/',
  twitter: 'https://twitter.com/navi_protocol',
};

export const reservesPrefix = platformId;
export const reservesKey = 'reserves';

export const reserveParentId =
  '0xe6d4c6610b86ce7735ea754596d71d72d10c7980b5052fc3c8cdf8d09fea9b4b';

export const rateFactor = 27;

export const rewardsFunds = {
  f975bc2d4cca10e3ace8887e20afd77b46c383b4465eac694c4688344955dea4: {
    coinType: '0x2::sui::SUI',
    oracleId: 0,
  },
  e2b5ada45273676e0da8ae10f8fe079a7cec3d0f59187d3d20b1549c275b07ea: {
    coinType:
      '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT',
    oracleId: 5,
  },
  a20e18085ce04be8aa722fbe85423f1ad6b1ae3b1be81ffac00a30f1d6d6ab51: {
    coinType:
      '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI',
    oracleId: 6,
  },
  '9dae0cf104a193217904f88a48ce2cf0221e8cd9073878edd05101d6b771fa09': {
    coinType:
      '0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX',
    oracleId: 7,
  },
};

export const incentiveFunction =
  '0x64372b54147adb0ac8a603adab92c81e3d732c8cafafa368d8f3ff9dcb6a53af::incentive_getter::get_incentive_pools_group_by_phase';
export const incentiveObjectId =
  '0xf87a8acb8b81d14307894d12595541a73f19933f88e1326d5be349c7a6f7559c';
export const incentiveStorageObjectId =
  '0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe';
