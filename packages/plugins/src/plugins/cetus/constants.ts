import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'cetus';
export const platform: Platform = {
  id: platformId,
  name: 'Cetus',
  image: 'https://sonar.watch/img/platforms/cetus.png',
  defiLlamaId: 'cetus',
  website: 'https://www.cetus.zone/',
};
export const clmmPoolsPrefix = `${platformId}-clmmPools`;

export const clmmPoolPackageId =
  '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb';

export const clmmType = `${clmmPoolPackageId}::position::Position`;

export const createPoolEvent = `${clmmPoolPackageId}::factory::CreatePoolEvent`;
