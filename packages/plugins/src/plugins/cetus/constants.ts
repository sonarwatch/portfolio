import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'cetus';
export const cetusPlatform: Platform = {
  id: platformId,
  name: 'Cetus',
  image: 'https://alpha.sonar.watch/img/platforms/cetus.png',
};
export const clmmPoolsPrefix = `${platformId}-clmmPools`;

export const clmmPoolPackageId =
  '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb';

export const clmmType = `${clmmPoolPackageId}::position::Position`;

export const clmmPoolsHandle =
  '0x37f60eb2d9d227949b95da8fea810db3c32d1e1fa8ed87434fc51664f87d83cb';
