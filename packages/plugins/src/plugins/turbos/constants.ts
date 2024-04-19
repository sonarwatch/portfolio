import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'turbos';
export const platform: Platform = {
  id: platformId,
  name: 'Turbos',
  image: 'https://sonar.watch/img/platforms/turbos.png',
  defiLlamaId: 'turbos',
  website: 'https://app.turbos.finance/',
};
export const clmmPoolsPrefix = `${platformId}-clmmPools`;

export const poolTableId =
  '0x08984ed8705f44b6403705dc248896e56ab7961447820ae29be935ce0d32198b';

export const packageIdOriginal =
  '0x91bfbc386a41afcfd9b2533058d7e915a1d3829089cc268ff4333d54d6339ca1';

export const clmmNftType = `${packageIdOriginal}::position_nft::TurbosPositionNFT`;
