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
