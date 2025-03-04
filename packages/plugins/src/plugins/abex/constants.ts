import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'abex';
export const platform: Platform = {
  id: platformId,
  name: 'ABEx Finance',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/abex.webp',
  website: 'https://abex.fi/',
  twitter: 'https://twitter.com/ABExFinance',
  defiLlamaId: 'abex-finance', // from https://defillama.com/docs/api
};

export const stakingPackage =
  '0xc985ff436f334f864d74f35c3da9e116419b63a0c027cbe2ac7815afc4abc450';
export const corePackage =
  '0xceab84acf6bf70f503c3b0627acaff6b3f84cee0f2d7ed53d00fa6c2a168d14f';
export const positionsParent =
  '0x251910096bd975afdb4413a3b4c0a158b0097c0c4cd242e1a24db5882011cac2';
export const ordersParent =
  '0x6a318ab871926d031bd3bf2cebb0426d44d917f0cc649ffea40ccba02b89700d';
export const vaultsParent =
  '0x3c6595e543c4766dd63b5b2fa918516bac2920bc1944da068be031dced46a18d';
export const symbolsParent =
  '0xa23d31c1fed163b675911aef7ed57bf4acf9f21f41fca02df7cef42c87083351';
export const abexMarket =
  '0x7705d4670e7ef4623d6392888f73f6773b5f0218b6cb1486a4be238692a58bca';
export const abexMarketCacheKey = 'abexmarket';

export const alpType =
  '0xceab84acf6bf70f503c3b0627acaff6b3f84cee0f2d7ed53d00fa6c2a168d14f::alp::ALP';
export const alpDecimals = 6;
export const depositVaultRegistry =
  '0x3c6595e543c4766dd63b5b2fa918516bac2920bc1944da068be031dced46a18d';
export const poolObjectId =
  '0x9a1c1130b6c8c6b465397ef8a99b2917c5a7a957df98cb4812212674aa971f63';
export const poolAccRewardPerShareKey = 'accRewardPerShare';
