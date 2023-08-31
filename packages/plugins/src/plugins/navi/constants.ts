import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'navi';
export const aftermathPlatform: Platform = {
  id: platformId,
  name: 'Navi',
  image: `https://alpha.sonar.watch/img/platforms/${platformId}.png`,
};

export const reservePrefix = `${platformId}-reserves`;
export const packageReserveData =
  '0xd899cf7d2b5db716bd2cf55599fb0d5ee38a3061e7b6bb6eebf73fa5bc4c81ca::storage::ReserveData>';

export const poolsInfos = [
  {
    id: 0,
    name: 'sui',
    reserveData:
      '0xab644b5fd11aa11e930d1c7bc903ef609a9feaf9ffe1b23532ad8441854fbfaf',
    pool: '0x96df0fce3c471489f4debaaa762cf960b3d97820bd1f3f025ff8190730e958c5',
  },
  {
    id: 1,
    name: 'usdc',
    reserveData:
      '0xeb3903f7748ace73429bd52a70fff278aac1725d3b58afa781f25ce3450ac203',
    pool: '0xa02a98f9c88db51c6f5efaaf2261c81f34dd56d86073387e0ef1805ca22e39c8',
  },
  {
    id: 2,
    name: 'usdt',
    reserveData:
      '0xb8c5eab02a0202f638958cc79a69a2d30055565caad1684b3c8bbca3bddcb322',
    pool: '',
  },
];
