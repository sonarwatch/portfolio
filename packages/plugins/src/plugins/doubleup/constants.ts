import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'doubleup';
export const platform: Platform = {
  id: platformId,
  name: 'DoubleUp',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/doubleup.webp',
  website: 'https://www.doubleup.fun/',
  twitter: 'https://x.com/doubleup_app',
  defiLlamaId: 'doubleup', // from https://defillama.com/docs/api
};

export const houseType =
  '0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593::house::House';
export const unihouse =
  '0x75c63644536b1a7155d20d62d9f88bf794dc847ea296288ddaf306aa320168ab';
export const redeemType =
  '0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593::unihouse::RedeemRequest';
export const redeemTicketsKey = 'redeemTickets';
