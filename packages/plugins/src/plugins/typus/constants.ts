import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'typus';
export const platform: Platform = {
  id: platformId,
  name: 'Typus',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/typus.webp',
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

export const vaultsIndexes = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
];
export const safuVaultsNames: { [key: string]: string } = {
  '0': 'SUI Daily Bull',
  '1': 'SUI Daily Bear',
  '2': 'Daily All Weather',
  '3': 'Daily All Weather',
  '4': 'SUI Hourly Bull',
  '5': 'SUI Hourly Bear',
  '6': 'BTC Daily Bull',
  '7': 'BTC Daily Bear',
  '8': 'ETH Daily Bull',
  '9': 'ETH Daily Bear',
  '10': 'SOL Daily Bull',
  '11': 'SOL Daily Bear',
  '12': 'SUI Daily Bull',
  '13': 'SUI Daily Bull',
  '14': 'Daily All Weather',
  '15': 'SUI Hourly Bear',
  '16': 'SUI Daily Bear',
  '17': 'BTC Daily Bull',
  '18': 'BTC Daily Bear',
  '19': 'ETH Daily Bull',
  '20': 'ETH Daily Bear',
  '21': 'SOL Daily Bull',
  '22': 'SOL Daily Bear',
  '23': 'SUI Daily Bear',
  '24': 'TYPUS Daily Bull',
  '25': 'TYPUS Daily Bull',
  '26': 'TYPUS Daily Bear',
  '27': 'TYPUS Daily Bear',
};
