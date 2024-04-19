import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'abex';
export const abexPlatform: Platform = {
  id: platformId,
  name: 'ABEx Finance',
  image: 'https://sonar.watch/img/platforms/abex.webp',
  website: 'https://abex.fi/',
  twitter: 'https://twitter.com/ABExFinance',
  defiLlamaId: 'abex-finance', // from https://defillama.com/docs/api
};

export const alpType =
  '0xceab84acf6bf70f503c3b0627acaff6b3f84cee0f2d7ed53d00fa6c2a168d14f::alp::ALP';
export const alpDecimals = 6;
export const depositVaultRegistry =
  '0x3c6595e543c4766dd63b5b2fa918516bac2920bc1944da068be031dced46a18d';
export const alpSupplyObjectId =
  '0x7705d4670e7ef4623d6392888f73f6773b5f0218b6cb1486a4be238692a58bca';
export const poolObjectId =
  '0x9a1c1130b6c8c6b465397ef8a99b2917c5a7a957df98cb4812212674aa971f63';
export const poolAccRewardPerShareKey = 'accRewardPerShare';
