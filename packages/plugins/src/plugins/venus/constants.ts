import { Platform } from '@sonarwatch/portfolio-core';
import upperCaseFirstLetter from '../../utils/misc/upperCaseFirstLetter';

export const platformId = 'venus';
export const venusPlatform: Platform = {
  id: platformId,
  name: upperCaseFirstLetter(platformId),
  image: 'https://sonar.watch/img/platforms/venus.png',
  defiLlamaId: 'venus-core-pool',
  website: 'https://app.venus.io/',
};

export const comptrollerVenus = '0xfD36E2c2a6789Db23113685031d7F16329158384';
