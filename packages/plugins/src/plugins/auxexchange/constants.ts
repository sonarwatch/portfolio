import { Platform } from '@sonarwatch/portfolio-core';
import { coinInfo } from '../../utils/aptos';

export const platformId = 'auxexchange';
export const auxExchangePlatform: Platform = {
  id: platformId,
  name: 'Aux Exchange',
  image: 'https://alpha.sonar.watch/img/platforms/auxexchange.png',
};

export const programAddress =
  '0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541';
export const lpTypePrefix = `${programAddress}::amm::LP<`;
export const lpCoinInfoTypePrefix = `${coinInfo}<${lpTypePrefix}`;
