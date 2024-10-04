import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'typus';
export const platform: Platform = {
  id: platformId,
  name: 'Typus',
  image: 'https://sonar.watch/img/platforms/typus.webp',
  defiLlamaId: 'parent#typus-finance', // from https://defillama.com/docs/api
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

export const safuPackage =
  '0x8bde4eedabbdaf0c4c463c4eb35f00456dbac5fdccb94ce9c2d7a77653aa481f';
export const frameworkPackage =
  '0x5c6648fb219c046256488486d23d4af7bc562d5ab5c382e1f4b558066a327fe8';
export const safuRegistryId =
  '0xdc970d638d1489385e49ddb76889748011bac4616b95a51aa63633972b841706';
export const safuVaultsKey = 'safu-vaults';

export const vaultsIndexes = ['0', '1', '2', '3'];
export const safuVaultsNames: { [key: string]: string } = {
  '0': 'Bull',
  '1': 'Bear',
  '2': 'All Weather SUI',
  '3': 'All Weather USDC',
};
