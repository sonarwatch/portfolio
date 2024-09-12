import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'cetus';
export const platform: Platform = {
  id: platformId,
  name: 'Cetus',
  image: 'https://sonar.watch/img/platforms/cetus.webp',
  defiLlamaId: 'cetus',
  website: 'https://www.cetus.zone/',
};
export const clmmPoolsPrefix = `${platformId}-clmmPools`;

export const clmmPoolPackageId =
  '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb';

export const clmmType = `${clmmPoolPackageId}::position::Position`;

export const createPoolEvent = `${clmmPoolPackageId}::factory::CreatePoolEvent`;
export const poolParentId =
  '0x4c9ab808d50ca1358cc699bb53b6334b9471d4718fb19bb621ff41c2e93bbce4';
export const firstPool =
  '0x58ec75646f31c384f485bd92a5f1d19aa60713eabe2447cbc1354c8c229b10b7';

// VaultsManager : 0x25b82dd2f5ee486ed1c8af144b89a8931cd9c29dee3a86a1bfe194fdea9d04a6
// Vaults https://api-sui.cetus.zone/v2/sui/auto_pools
export const vaultManagerMap =
  '0x9036bcc5aa7fd2cceec1659a6a1082871f45bc400c743f50063363457d1738bd';

export const farmNftType =
  '0x11ea791d82b5742cc8cab0bf7946035c97d9001d7c3803a93f119753da66f526::pool::WrappedPositionNFT';
