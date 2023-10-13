import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'navi';
export const naviPlatform: Platform = {
  id: platformId,
  name: 'NAVI',
  image: `https://sonar.watch/img/platforms/${platformId}.png`,
  defiLlamaId: 'navi-protocol',
};

export const reservesPrefix = platformId;
export const reservesKey = 'reserves';

export const reserveParentId =
  '0xe6d4c6610b86ce7735ea754596d71d72d10c7980b5052fc3c8cdf8d09fea9b4b';

export const poolsInfos = [
  {
    id: 0,
    name: 'sui',
    type: '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
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
];
