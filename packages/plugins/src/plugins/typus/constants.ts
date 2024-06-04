import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'typus';
export const platform: Platform = {
  id: platformId,
  name: 'Typus',
  image: 'https://sonar.watch/img/platforms/typus.webp',
  defiLlamaId: 'typus-finance', // from https://defillama.com/docs/api
  website: 'https://typus.finance/',
  twitter: 'https://twitter.com/TypusFinance',
};
export const packageId =
  '0xb4f25230ba74837d8299e92951306100c4a532e8c48cc3d8828abe9b91c8b274';
export const depositReceiptType = `${packageId}::vault::TypusDepositReceipt`;
export const sender =
  '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const packageDovSingle =
  '0x9c907e9af7bedaab3382542f342cce21ca95fa72bedcc887edb478d17f8293d1';
export const registryDovSingle =
  '0x3d70b09359e3ca8301ae0abeda4f2fdf72ce313ba58c919ce568e5f535fd2ea8';
export const viewDepositSharesType = `${packageDovSingle}::tds_view_function::get_deposit_shares_bcs`;
