import { Platform, suiNetwork } from '@sonarwatch/portfolio-core';
import { usdcSuiType } from '../../utils/sui/constants';

export const platformId = 'kai';
export const platform: Platform = {
  id: platformId,
  name: 'Kai Finance',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/kai.webp',
  website: 'https://kai.finance',
  twitter: 'https://twitter.com/kai_finance_sui',
  defiLlamaId: 'kai-finance', // from https://defillama.com/docs/api
};

export const vaultsInfo = [
  {
    // wUSDC
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
  {
    // USDC
    id: '0x5663035df5f403ad5a015cc2a3264de30370650bc043c4dab4d0012ea5cb7671',
    tType: usdcSuiType,
    lpType:
      '0xa4184b1a5829e7cced8e51e8e385b16d02642634cd3e72a50d31cdf4a78bfd5c::yusdc::YUSDC',
    decimals: 6,
  },
];

export const supplyPoolsCacheKey = 'supply-pools';
export const vaults = [
  {
    name: 'Cetus wUSDT/wUSDC',
    configId:
      '0x2d52e5fe8af24f2c750250fca6ce5d595d22287f12d29c6ffbae490f5650478d',
    poolObjectId:
      '0xc8d7a1503dc2f9f5b05449a87d8733593e2f0f3e7bffd90541252782e4d2ca20',
    lendFacilCap:
      '0xf61382ca5e79c6bdccba39fc375c7b34daa02c7076369a8a34741f22980607ff',
    supplyPoolXInfo:
      '0x372b6948ae06dacce75fdc3546865b2e777d4050114d93db0717b40cf677634c',
    supplyPoolYInfo:
      '0x86c5ca41be63b5b9a8da0b4ca0f8268d6e87f8cdda8c9e88b25c43efcd5f3074',
  },
  {
    name: 'Cetus USDC/wUSDT',
    configId:
      '0xc64d5b0102b85b823d8f8ae5685ea1c153d1c18dcf13a4719798fdf591a9a1b9',
    poolObjectId:
      '0x6bd72983b0b5a77774af8c77567bb593b418ae3cd750a5926814fcd236409aaa',
    lendFacilCap:
      '0x085807ffff95935d311a714cdffa0d10ec7dc80e6bd393cee2b644f6aece5b01',
    supplyPoolXInfo:
      '0x3bcadd850b776542b49be5d68d2e62b63f3c7543695c55a973d3364501b5c26c',
    supplyPoolYInfo:
      '0x372b6948ae06dacce75fdc3546865b2e777d4050114d93db0717b40cf677634c',
  },
  {
    name: 'Cetus USDC/SUI',
    configId:
      '0xd6a055c8143f2bb97fdcb34f91ac723708d71473e7dff670a9a2218cc91eab16',
    poolObjectId:
      '0xb8d7d9e66a60c239e7a60110efcf8de6c705580ed924d0dde141f4a0e2c90105',
    lendFacilCap:
      '0x590468991d9ed6993953e46dad98b9ec5b003ce99d213346b4349c12880547b2',
    supplyPoolXInfo:
      '0x3bcadd850b776542b49be5d68d2e62b63f3c7543695c55a973d3364501b5c26c',
    supplyPoolYInfo:
      '0x1b4c4e0869ab3771a0901a538c0dbf536ca72e1525fd66e6c5a197623cd55cc8',
  },
];
