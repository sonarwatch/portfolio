import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'suilend';
export const platform: Platform = {
  id: platformId,
  name: 'Suilend',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/suilend.webp',
  defiLlamaId: 'suilend', // from https://defillama.com/docs/api
  website: 'https://www.suilend.fi/',
  twitter: 'https://twitter.com/suilendprotocol',
};

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://suilend.fi/send',
  emitterLink: 'https://suilend.fi',
  emitterName: 'Suilend',
  id: 'suilend-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/suilend.webp',
  claimEnd: 1765512000000,
  claimStart: 1733976000000,
};

export const mSendMint =
  '0xda097d57ae887fbd002fb5847dd0ab47ae7e1b183fd36832a51182c52257e1bc::msend_series_1::MSEND_SERIES_1';
export const mSendCoinType = `0x2::coin::Coin<${mSendMint}>`;
export const suilendPointsType =
  '34fe4f3c9e450fed4d0a3c587ed842eec5313c30c3cc3c0841247c49425e246b::suilend_point::SUILEND_POINT';
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
