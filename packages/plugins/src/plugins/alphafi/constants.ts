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

export const alphaPoolsInfoKey = 'alphaPoolsInfo';
export const alphaToken =
  '0xfe3afec26c59e874f3c1d60b8203cb3852d2bb2aa415df9548b8d688e6683f93::alpha::ALPHA';

export const receiptTypes = [
  '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba7123::alphapool::Receipt', // ALPHA_POOL_RECEIPT
  '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba7123::alphafi_cetus_sui_pool::Receipt', // ALPHA_SUI_POOL_RECEIPT
  '0x2793db7aa0e0209afc84f0adb1b258973cf1c9da55c35ee85c18f2ed4912bb6f::alphafi_cetus_pool_base_a::Receipt', // CETUS RECEIPT
  '0x9bbd650b8442abb082c20f3bc95a9434a8d47b4bef98b0832dab57c1a8ba7123::alphafi_cetus_pool::Receipt', // CETUS RECEIPT
  '0x8f7d2c35e19c65213bc2153086969a55ec207b5a25ebdee303a6d9edd9c053e3::alphafi_navi_pool::Receipt', // NAVI RECEIPT
];

export const investorsPositionType =
  '0x2::dynamic_field::Field<vector<u8>, 0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::position::Position>';

export const investorByCetusPool: Map<string, string> = new Map([
  [
    '0x30066d9879374276dc01177fbd239a9377b497bcd347c82811d75fcda35b18e5',
    '0x87a76889bf4ed211276b16eb482bf6df8d4e27749ebecd13017d19a63f75a6d5',
  ],
  [
    '0x594f13b8f287003fd48e4264e7056e274b84709ada31e3657f00eeedc1547e37',
    '0x46d901d5e1dba34103038bd2ba789b775861ea0bf4d6566afd5029cf466a3d88',
  ],
  [
    '0xa7239a0c727c40ee3a139689b16b281acfd0682a06c23531b184a61721ece437',
    '0x1b923520f19660d4eb013242c6d03c84fdea034b8f784cfd71173ef72ece50e1',
  ],
  [
    '0xee6f6392cbd9e1997f6e4cf71db0c1ae1611f1f5f7f23f90ad2c64b8f23cceab',
    '0xb6ca8aba0fb26ed264a3ae3d9c1461ac7c96cdcbeabb01e71086e9a8340b9c55',
  ],
  [
    '0xbdf4f673b34274f36be284bca3f765083380fefb29141f971db289294bf679c6',
    '0x9ae0e56aa0ebc27f9d8a17b5a9118d368ba262118d878977b6194a10a671bbbc',
  ],
  [
    '0x676fc5cad79f51f6a7d03bfa3474ecd3c695d322380fc68e3d4f61819da3bf8a',
    '0x05fa099d1df7b5bfb2e420d5ee2d63508db17c40ce7c4e0ca0305cd5df974e43',
  ],
  [
    '0x045e4e3ccd383bedeb8fda54c39a7a1b1a6ed6a9f66aec4998984373558f96a0',
    '0xdd9018247d579bd7adfdbced4ed39c28821c6019461d37dbdf32f0d409959b1c',
  ],
]);

export const alphaVaultAddress =
  '0x6ee8f60226edf48772f81e5986994745dae249c2605a5b12de6602ef1b05b0c1';

export const naviPools = [
  '0x01493446093dfcdcfc6c16dc31ffe40ba9ac2e99a3f6c16a0d285bff861944ae', // USDC
  '0xe4eef7d4d8cafa3ef90ea486ff7d1eec347718375e63f1f778005ae646439aad', // WETH
  '0x643f84e0a33b19e2b511be46232610c6eb38e772931f582f019b8bbfb893ddb3', // SUI
  '0x0d9598006d37077b4935400f6525d7f1070784e2d6f04765d76ae0a4880f7d0a', // VSUI
  '0xc696ca5b8f21a1f8fcd62cff16bbe5a396a4bed6f67909cfec8269eb16e60757', // USDT
];
