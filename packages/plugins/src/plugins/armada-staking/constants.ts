import { PublicKey } from '@solana/web3.js';
import { platformId as sharkyPlatformId } from '../sharky/constants';

export const platformId = 'armada-staking-program';
export const stakePid = new PublicKey(
  'STAKEGztX7S1MUHxcQHieZhELCntb9Ys9BgUbeEtMu1'
);
export const poolsKey = 'pools';

export const armadaPlatformId = 'armada';
export const flowmaticPlatformId = 'flowmatic';
export const kishuPlatformId = 'kishu';
export const yakuPlatformId = 'yaku';
export const madbearsPlatformId = 'madbears';
export const orePlatformId = 'ore-refinery';
export const garyPlatformId = 'gary';
export const geckoPlatformId = 'gecko';
export const brawlPlatformId = 'brawl';
export const akumaPlatformId = 'akuma';
export const gofursPlatformId = 'gofurs';

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
