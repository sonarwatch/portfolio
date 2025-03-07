import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { platformId as sharkyPlatformId } from '../sharky/constants';

export const platformId = 'armada-staking-program';
export const stakePid = new PublicKey(
  'STAKEGztX7S1MUHxcQHieZhELCntb9Ys9BgUbeEtMu1'
);
export const poolsKey = 'pools';

export const armadaPlatformId = 'armada';
export const armadaPlatform: Platform = {
  id: armadaPlatformId,
  name: 'Armada',
  defiLlamaId: 'armada-staking',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/armada.webp',
  website: 'https://armada-alliance.com/',
  twitter: 'https://x.com/armadafi',
  github: 'https://github.com/mithraiclabs',
  description:
    'No code token staking setup on solana. Professionally managed and non custodial token liquidity strategies.',
  isDeprecated: true,
};

export const flowmaticPlatformId = 'flowmatic';
export const flowmaticPlatform: Platform = {
  id: flowmaticPlatformId,
  name: 'Flowmatic',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/flowmatic.webp',
  website: 'https://www.flowmatic.xyz/',
  twitter: 'https://twitter.com/FlowmaticXYZ',
  discord: 'https://discord.gg/flowmatic',
  documentation: 'https://docs.flowmatic.xyz/',
};

export const kishuPlatformId = 'kishu';
export const kishuPlatform: Platform = {
  id: kishuPlatformId,
  name: 'Kishu',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/kishu.webp',
  website: 'https://staking.kishuthedog.com/',
  twitter: 'https://twitter.com/kishuthedog',
};

export const yakuPlatformId = 'yaku';
export const yakuPlatform: Platform = {
  id: yakuPlatformId,
  name: 'Yaku',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/yaku.webp',
  website: 'https://staking.yaku.gg/',
  twitter: 'https://twitter.com/YakuCorp',
};

export const madbearsPlatformId = 'madbears';
export const madbearsPlatform: Platform = {
  id: madbearsPlatformId,
  name: 'MadBears',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/madbears.webp',
  website: 'https://staking.madbears.club/',
  twitter: 'https://twitter.com/madbearsclub',
};

export const orePlatformId = 'ore-refinery';
export const orePlatform: Platform = {
  id: orePlatformId,
  name: 'Ore Refinery',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/ore.webp',
  website: 'https://ore-refinery.netlify.app/',
  twitter: 'https://twitter.com/OreSupply',
};

export const garyPlatformId = 'gary';
export const garyPlatform: Platform = {
  id: garyPlatformId,
  name: 'Gary',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/gary.webp',
  website: 'https://gary.club/lock_gary',
  twitter: 'https://twitter.com/GaryCoinOnSol',
};

export const geckoPlatformId = 'gecko';
export const geckoPlatform: Platform = {
  id: geckoPlatformId,
  name: 'Gecko',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/gecko.webp',
  website: 'https://staking.geckocoin.xyz/',
  twitter: 'https://twitter.com/GeckCoin',
};

export const brawlPlatformId = 'brawl';
export const brawlPlatform: Platform = {
  id: brawlPlatformId,
  name: 'Brawl AI',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/brawl.webp',
  website: 'https://staking.brawlailayer.org/',
};

export const akumaPlatformId = 'akuma';
export const akumaPlatform: Platform = {
  id: akumaPlatformId,
  name: 'Akuma',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/akuma.webp',
  website: 'https://staking.theakuma.xyz',
};

export const gofursPlatformId = 'gofurs';
export const gofurslatform: Platform = {
  id: gofursPlatformId,
  name: 'Gofurs',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/gofurs.webp',
  website: 'https://stake.gofursdelsol.com/',
};

export const platformByMint = new Map([
  ['BDssJun8XSPmWq7VkoahyozsvJwKEZBkWE6YBrFHjbii', kishuPlatformId],
  ['AqEHVh8J2nXH9saV2ciZyYwPpqWFRfD2ffcq5Z8xxqm5', yakuPlatformId],
  ['Eh1fXbAipe4k7CYR9UMb2bbWmBcpU3HcyX3LWuRVFBLz', flowmaticPlatformId],
  ['Ee1pKgTQmP5xjYQs76HmRM2c2YkqEdc9tk5mQbiGFigT', madbearsPlatformId],
  ['oreoN2tQbHXVaZsr3pf66A48miqcBXCDJozganhEJgz', orePlatformId],
  ['8c71AvjQeKKeWRe8jtTGG1bJ2WiYXQdbjqFbUfhHgSVk', garyPlatformId],
  ['6CNHDCzD5RkvBWxxyokQQNQPjFWgoHF94D7BmC73X6ZK', geckoPlatformId],
  ['SHARKSYJjqaNyxVfrpnBN9pjgkhwDhatnMyicWPnr1s', sharkyPlatformId],
  ['5mdBkZ4dTP94SE7PyiuWseTDAd1kYxSk6oYaWB7186s7', brawlPlatformId],
  ['AKUjRM9ZcE8t4mQWGX8ToroNjrTSYvNR3bBfFMzY7ahb', akumaPlatformId],
  ['4xnxNjLkeVoJEAUFjj5xTvkdTLGYHtrdyyXThGDFhwmr', gofursPlatformId],
]);
