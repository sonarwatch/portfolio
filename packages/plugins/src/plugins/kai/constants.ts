import { Platform, suiNetwork } from '@sonarwatch/portfolio-core';

export const platformId = 'kai';
export const platform: Platform = {
  id: platformId,
  name: 'Kai Finance',
  image: 'https://sonar.watch/img/platforms/kai.webp',
  website: 'https://kai.finance',
  twitter: 'https://twitter.com/kai_finance_sui',
  defiLlamaId: 'kai-finance', // from https://defillama.com/docs/api
};

export const vaultsInfo = [
  {
    // USDC
    id: '0x7a2f75a3e50fd5f72dfc2f8c9910da5eaa3a1486e4eb1e54a825c09d82214526',
    tType:
      '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
    lpType:
      '0x1c389a85310b47e7630a9361d4e71025bc35e4999d3a645949b1b68b26f2273::ywhusdce::YWHUSDCE',
    decimals: 6,
  },
  {
    // USDT
    id: '0x0fce8baed43faadf6831cd27e5b3a32a11d2a05b3cd1ed36c7c09c5f7bcb4ef4',
    tType:
      '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
    lpType:
      '0xb8dc843a816b51992ee10d2ddc6d28aab4f0a1d651cd7289a7897902eb631613::ywhusdte::YWHUSDTE',
    decimals: 6,
  },
  {
    // SUI
    id: '0x16272b75d880ab944c308d47e91d46b2027f55136ee61b3db99098a926b3973c',
    tType: suiNetwork.native.address,
    lpType:
      '0xb8dc843a816b51992ee10d2ddc6d28aab4f0a1d651cd7289a7897902eb631613::ysui::YSUI',
    decimals: 9,
  },
];
