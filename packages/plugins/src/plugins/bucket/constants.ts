import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'bucket';
export const bucketPlatform: Platform = {
  id: platformId,
  name: 'Bucket',
  image: 'https://alpha.sonar.watch/img/platforms/bucket.png',
  defiLlamaId: 'bucket-protocol',
};

export const bottleType =
  '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::bottle::Bottle';
export const buckId =
  '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK';

export const collaterals = [
  {
    tokenId: '0x2::sui::SUI',
    parentId:
      '0x86050d85ebdafe3bda92c36c8489d46a233f57f103672647062f72f3fe37a46d',
  },
  {
    tokenId:
      '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
    parentId:
      '0x44529d74a43073c40963fe42c8d2e51d8a441d480ee105ea0c27f3847433ae21',
  },
  {
    tokenId:
      '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN',
    parentId:
      '0x9cba3b4a99686c924ff3dc8940b70b35348bbe457767419be19feaec5594255c',
  },
  {
    tokenId:
      '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
    parentId:
      '0xd21552e2b0df056f5f86206d758d4c87438d302e592575099726bd9d0ea16128',
  },
];
