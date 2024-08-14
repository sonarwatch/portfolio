import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'alphafi';
export const platform: Platform = {
  id: platformId,
  name: 'Alpha Fi',
  image: 'https://sonar.watch/img/platforms/alphafi.webp',
  website: 'https://alphafi.xyz/',
  twitter: 'https://x.com/AlphaFiSUI',
  defiLlamaId: 'alphafi', // from https://defillama.com/docs/api
};

export const alphaToken =
  '0xfe3afec26c59e874f3c1d60b8203cb3852d2bb2aa415df9548b8d688e6683f93::alpha::ALPHA';

const receiptTypes = {
  ALPHA_POOL_RECEIPT:
    '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba7123::alphapool::Receipt',
  ALPHA_SUI_POOL_RECEIPT:
    '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba7123::alphafi_cetus_sui_pool::Receipt',
  USDT_USDC_POOL_RECEIPT:
    '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba7123::alphafi_cetus_pool::Receipt',
  USDY_USDC_POOL_RECEIPT:
    '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba7123::alphafi_cetus_pool::Receipt',
  HaSUI_SUI_POOL_RECEIPT:
    '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba7123::alphafi_cetus_sui_pool::Receipt',
  USDC_SUI_POOL_RECEIPT:
    '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba7123::alphafi_cetus_sui_pool::Receipt',
  USDC_WBTC_POOL_RECEIPT:
    '0x2793db7aa0e0209afc84f0adb1b258973cf1c9da55c35ee85c18f2ed4912bb6f::alphafi_cetus_pool_base_a::Receipt',
  WETH_USDC_POOL_RECEIPT:
    '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba7123::alphafi_cetus_pool::Receipt',
  NAVI_SUI_POOL_RECEIPT:
    '0x8f7d2c35e19c65213bc2153086969a55ec207b5a25ebdee303a6d9edd9c053e3::alphafi_navi_pool::Receipt',
  NAVI_VSUI_POOL_RECEIPT:
    '0x8f7d2c35e19c65213bc2153086969a55ec207b5a25ebdee303a6d9edd9c053e3::alphafi_navi_pool::Receipt',
  NAVI_WETH_POOL_RECEIPT:
    '0x8f7d2c35e19c65213bc2153086969a55ec207b5a25ebdee303a6d9edd9c053e3::alphafi_navi_pool::Receipt',
  NAVI_USDT_POOL_RECEIPT:
    '0x8f7d2c35e19c65213bc2153086969a55ec207b5a25ebdee303a6d9edd9c053e3::alphafi_navi_pool::Receipt',
  NAVI_USDC_POOL_RECEIPT:
    '0x8f7d2c35e19c65213bc2153086969a55ec207b5a25ebdee303a6d9edd9c053e3::alphafi_navi_pool::Receipt',
  NAVX_SUI_POOL_RECEIPT:
    '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba7123::alphafi_cetus_sui_pool::Receipt',
};
export const distinctReceiptTypes = [
  ...new Set<string>(Object.values(receiptTypes)),
];

export const alphaPoolReceiptType = receiptTypes['ALPHA_POOL_RECEIPT'];

export const cetusPoolMap: {
  [key: string]: string;
} = {
  '0xee6f6392cbd9e1997f6e4cf71db0c1ae1611f1f5f7f23f90ad2c64b8f23cceab':
    '0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630',
  '0x30066d9879374276dc01177fbd239a9377b497bcd347c82811d75fcda35b18e5':
    '0xc8d7a1503dc2f9f5b05449a87d8733593e2f0f3e7bffd90541252782e4d2ca20',
  '0xa7239a0c727c40ee3a139689b16b281acfd0682a06c23531b184a61721ece437':
    '0x0e809689d04d87f4bd4e660cd1b84bf5448c5a7997e3d22fc480e7e5e0b3f58d',
  '0xb75f427854fef827233ae838d1c23eefd420a540d8fa83fb40f77421dafb84d4':
    '0x871d8a227114f375170f149f7e9d45be822dd003eba225e83c05ac80828596bc',
  '0x594f13b8f287003fd48e4264e7056e274b84709ada31e3657f00eeedc1547e37':
    '0xda7347c3192a27ddac32e659c9d9cbed6f8c9d1344e605c71c8886d7b787d720',
  '0xbdf4f673b34274f36be284bca3f765083380fefb29141f971db289294bf679c6':
    '0x5b0b24c27ccf6d0e98f3a8704d2e577de83fa574d3a9060eb8945eeb82b3e2df',
  '0x676fc5cad79f51f6a7d03bfa3474ecd3c695d322380fc68e3d4f61819da3bf8a':
    '0xaa57c66ba6ee8f2219376659f727f2b13d49ead66435aa99f57bb008a64a8042',
  '0x045e4e3ccd383bedeb8fda54c39a7a1b1a6ed6a9f66aec4998984373558f96a0':
    '0x0254747f5ca059a1972cd7f6016485d51392a3fde608107b93bbaebea550f703',
};
