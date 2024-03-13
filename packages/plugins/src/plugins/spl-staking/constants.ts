import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'spl-staking';
export const splStakingPlatform: Platform = {
  id: platformId,
  name: 'SPL Staking',
  image: 'https://sonar.watch/img/platforms/splStaking.png',
};
export const stakePid = new PublicKey(
  'STAKEGztX7S1MUHxcQHieZhELCntb9Ys9BgUbeEtMu1'
);
export const poolsKey = 'pools';

export const flowmaticPlatformId = 'flowmatic';
export const flowmaticPlatform: Platform = {
  id: flowmaticPlatformId,
  name: 'Flowmatic',
  image: 'https://sonar.watch/img/platforms/flowmatic.png',
  website: 'https://www.flowmatic.xyz/',
  twitter: 'https://twitter.com/FlowmaticXYZ',
};

export const kishuPlatformId = 'kishu';
export const kishuPlatform: Platform = {
  id: kishuPlatformId,
  name: 'Kishu',
  image: 'https://sonar.watch/img/platforms/kishu.png',
  website: 'https://staking.kishuthedog.com/',
  twitter: 'https://twitter.com/FlowmaticXYZ',
};

export const yakuPlatformId = 'yaku';
export const yakuPlatform: Platform = {
  id: yakuPlatformId,
  name: 'Yaku',
  image: 'https://sonar.watch/img/platforms/yaku.png',
  website: 'https://staking.yaku.gg/',
  twitter: 'https://twitter.com/FlowmaticXYZ',
};

export const madbearsPlatformId = 'madbears';
export const madbearsPlatform: Platform = {
  id: madbearsPlatformId,
  name: 'MadBears',
  image: 'https://sonar.watch/img/platforms/madbears.png',
  website: 'https://staking.madbears.club/',
  twitter: 'https://twitter.com/FlowmaticXYZ',
};

export const platformByMint = new Map([
  ['BDssJun8XSPmWq7VkoahyozsvJwKEZBkWE6YBrFHjbii', kishuPlatformId],
  ['AqEHVh8J2nXH9saV2ciZyYwPpqWFRfD2ffcq5Z8xxqm5', yakuPlatformId],
  ['Eh1fXbAipe4k7CYR9UMb2bbWmBcpU3HcyX3LWuRVFBLz', flowmaticPlatformId],
  ['Ee1pKgTQmP5xjYQs76HmRM2c2YkqEdc9tk5mQbiGFigT', madbearsPlatformId],
]);
