import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'typus';
export const platform: Platform = {
  id: platformId,
  name: 'Typus',
  image: 'https://sonar.watch/img/platforms/typus.webp',
  defiLlamaId: 'typus-finance', // from https://defillama.com/docs/api
  website: 'https://typus.finance/yield/',
  twitter: 'https://twitter.com/TypusFinance',
};

export const depositReceiptType =
  '0xb4f25230ba74837d8299e92951306100c4a532e8c48cc3d8828abe9b91c8b274::vault::TypusDepositReceipt';
