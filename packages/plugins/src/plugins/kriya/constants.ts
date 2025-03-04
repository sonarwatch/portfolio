import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'kriya';
export const platform: Platform = {
  id: platformId,
  name: 'Kriya',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/kriya.webp',
  defiLlamaId: 'parent#kriyadex', // from https://defillama.com/docs/api
  website: 'https://www.app.kriya.finance/',
  twitter: 'https://twitter.com/KriyaDEX',
};

// strategies / lp rebalancing
export const strategyLpRebalancingUrl =
  'https://api-service-81678480858.asia-northeast1.run.app/vaults/';
export const strategyLpRebalancingInfoKey = 'strategyLpRebalancingInfos';
export const strategyLpRebalancingStakeReceipt =
  '0xba0dd78bdd5d1b5f02a689444522ea9a79e1bc4cd4d8e6a57b59f3fbcae5e978::farm::StakeReceipt';
export const dynamicFieldPositionTypeCetus =
  '0x2::dynamic_field::Field<vector<u8>, 0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::position::Position>';
export const dynamicFieldPositionTypeKriya =
  '0x2::dynamic_field::Field<vector<u8>, 0xf6c05e2d9301e6e91dc6ab6c3ca918f7d55896e1f1edd64adc0e615cde27ebf1::position::Position>';

// liquidity / LP Pools v2
export const poolsV2PackageId =
  '0xa0eba10b173538c8fecca1dff298e488402cc9ff374f8a12ca7758eebe830b66';
export const lpPositionTypeV2 = `${poolsV2PackageId}::spot_dex::KriyaLPToken`;

// liquidity / LP Pools/Farms v2
export const poolsUrl =
  'https://api-service-81678480858.asia-northeast1.run.app/pools/v2';
export const poolsV2InfoKey = 'poolsV2Infos';
export const farmsPackageId =
  '0x88701243d0445aa38c0a13f02a9af49a58092dfadb93af9754edb41c52f40085';

// liquidity / lp Pools v3
export const poolsStats =
  'https://api-service-81678480858.asia-northeast1.run.app/pools/v3';
export const clmmPoolPackageId =
  '0xf6c05e2d9301e6e91dc6ab6c3ca918f7d55896e1f1edd64adc0e615cde27ebf1';
export const clmmType = `${clmmPoolPackageId}::position::Position`;
export const poolsV3StatsInfoKey = 'poolsV3StatsInfos';

// strategies / leverage lending
export const leverageLendingVaultsInfoKey = 'leverageLendingVaultsInfos';
export const leverageLendingVaultsUrl =
  'https://api-service-81678480858.asia-northeast1.run.app/vaults/';
