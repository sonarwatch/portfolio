import { Platform, suiNativeAddress } from '@sonarwatch/portfolio-core';

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

export const poolsInfos = [
  {
    id: 0,
    name: 'sui',
    type: suiNativeAddress,
    reserveData:
      '0xab644b5fd11aa11e930d1c7bc903ef609a9feaf9ffe1b23532ad8441854fbfaf',
    pool: '0x96df0fce3c471489f4debaaa762cf960b3d97820bd1f3f025ff8190730e958c5',
    borrowBalanceParentId:
      '0xe7ff0daa9d090727210abe6a8b6c0c5cd483f3692a10610386e4dc9c57871ba7',
    supplyBalanceParentId:
      '0x589c83af4b035a3bc64c40d9011397b539b97ea47edf7be8f33d643606bf96f8',
  },
  {
    id: 1,
    name: 'usdc',
    type: '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
    reserveData:
      '0xeb3903f7748ace73429bd52a70fff278aac1725d3b58afa781f25ce3450ac203',
    pool: '0xa02a98f9c88db51c6f5efaaf2261c81f34dd56d86073387e0ef1805ca22e39c8',
    borrowBalanceParentId:
      '0x8a3aaa817a811131c624658f6e77cba04ab5829293d2c49c1a9cce8ac9c8dec4',
    supplyBalanceParentId:
      '0x8d0a4467806458052d577c8cd2be6031e972f2b8f5f77fce98aa12cd85330da9',
  },
  {
    id: 2,
    name: 'usdt',
    type: '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
    reserveData:
      '0xb8c5eab02a0202f638958cc79a69a2d30055565caad1684b3c8bbca3bddcb322',
    pool: '',
    borrowBalanceParentId:
      '0xc14d8292a7d69ae31164bafab7ca8a5bfda11f998540fe976a674ed0673e448f',
    supplyBalanceParentId:
      '0x7e2a49ff9d2edd875f82b76a9b21e2a5a098e7130abfd510a203b6ea08ab9257',
  },
  {
    id: 3,
    name: 'weth',
    type: '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN',
    pool: '0x71b9f6e822c48ce827bceadce82201d6a7559f7b0350ed1daa1dc2ba3ac41b56',
    reserveData:
      '0xafecf4b57899d377cc8c9de75854c68925d9f512d0c47150ca52a0d3a442b735',
    borrowBalanceParentId:
      '0x7568d06a1b6ffc416a36c82791e3daf0e621cf19d4a2724fc6f74842661b6323',
    supplyBalanceParentId:
      '0xa668905b1ad445a3159b4d29b1181c4a62d864861b463dd9106cc0d97ffe8f7f',
  },
  {
    id: 4,
    name: 'cetus',
    type: '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
    pool: '0x71b9f6e822c48ce827bceadce82201d6a7559f7b0350ed1daa1dc2ba3ac41b56',
    reserveData:
      '0x66a807c06212537fe46aa6719a00e4fa1e85a932d0b53ce7c4b1041983645133',
    borrowBalanceParentId:
      '0x4c3da45ffff6432b4592a39cdb3ce12f4a28034cbcb804bb071facc81fdd923d',
    supplyBalanceParentId:
      '0x6adc72faf2a9a15a583c9fb04f457c6a5f0b456bc9b4832413a131dfd4faddae',
  },
];

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
