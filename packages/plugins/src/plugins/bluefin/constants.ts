import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'bluefin';
export const platform: Platform = {
  id: platformId,
  name: 'Bluefin',
  image: 'https://sonar.watch/img/platforms/bluefin.webp',
  defiLlamaId: 'bluefin', // from https://defillama.com/docs/api
  website: 'https://trade.bluefin.io/',
  twitter: 'https://x.com/bluefinapp',
};

export const aquaVault =
  '0x10d48e112b92c8af207c1850225284a7ca46bac1d935c4af4cf87ce29b121694';

export const bankObjectId =
  '0x39c65abefaee0a18ffa0e059a0074fcc9910216fa1a3550aa32c2e0ec1c03043';

export const poolKey = 'pool';
export const perpetualsKey = 'perpetuals';

export const metaUrl = 'https://dapi.api.sui-prod.bluefin.io/meta';
