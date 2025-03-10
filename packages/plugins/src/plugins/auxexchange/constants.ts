import { Platform } from '@sonarwatch/portfolio-core';
import { coinInfo } from '../../utils/aptos';

export const platformId = 'auxexchange';
export const platform: Platform = {
  id: platformId,
  name: 'Aux Exchange',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/auxexchange.webp',
  defiLlamaId: 'aux-exchange',
  website: 'https://aux.exchange/',
};

export const packageId =
  '0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541';
export const lpTypePrefix = `${packageId}::amm::LP<`;
export const lpCoinInfoTypePrefix = `${coinInfo}<${lpTypePrefix}`;
