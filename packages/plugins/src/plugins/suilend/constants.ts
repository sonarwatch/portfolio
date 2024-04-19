import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'suilend';
export const suilendPlatform: Platform = {
  id: platformId,
  name: 'Suilend',
  image: 'https://sonar.watch/img/platforms/suilend.png',
  defiLlamaId: 'suilend', // from https://defillama.com/docs/api
  website: 'https://www.suilend.fi/',
  twitter: 'https://twitter.com/suilendprotocol',
};

export const packageId =
  '0xf95b06141ed4a174f239417323bde3f209b972f5930d8521ea38a52aff3a6ddf';

export const obligationType = `${packageId}::obligation::Obligation`;
export const mainMarket =
  '0x84030d26d85eaa7035084a057f2f11f701b7e2e4eda87551becbc7c97505ece1';
export const marketsRegistry =
  '0x64faff8d91a56c4f55debbb44767b009ee744a70bc2cc8e3bbd2718c92f85931';

export const obligationOwnerCapType = `${packageId}::lending_market::ObligationOwnerCap<${packageId}`;
export const poolsKey = 'poolsInfo';
export const marketsKey = 'markets';
