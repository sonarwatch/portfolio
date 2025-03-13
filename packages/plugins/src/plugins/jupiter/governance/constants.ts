import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../../AirdropFetcher';
import { jupDecimals, jupMint } from '../launchpad/constants';
import { dbrDecimals, dbrMint } from '../../debridge/constants';

export const platformId = 'jupiter-governance';
const platformName = 'Jupiter DAO';
const platformImage = 'https://sonar.watch/img/platforms/jupiterdao.webp';
const platformWebsite = 'https://vote.jup.ag/';

export const jupDisProgram = 'Dis2TfkFnXFkrtvAktEkw37sdb7qwJgY6H7YZJwk51wK';
export const platform: Platform = {
  id: platformId,
  name: platformName,
  image: platformImage,
  website: platformWebsite,
  twitter: 'https://x.com/jup_dao',
  description: 'The first voting platform for Cats in history.',
  tokens: [jupMint],
};

export const asr1Statics: AirdropStatics = {
  id: `${platformId}-jup-asr-1`,
  claimLink: 'https://vote.jup.ag/asr',
  image: platformImage,
  emitterLink: platformWebsite,
  emitterName: 'Jupiter',
  claimStart: 1719792000000,
  claimEnd: 1722470400000,
  name: 'ASR #1',
};
export const asr2Statics: AirdropStatics = {
  id: `${platformId}-jup-asr-2`,
  claimLink: 'https://vote.jup.ag/asr',
  image: platformImage,
  emitterLink: platformWebsite,
  emitterName: 'Jupiter',
  claimStart: 1729512000000,
  claimEnd: 1732190400000,
  name: 'ASR #2',
};
export const asr3Statics: AirdropStatics = {
  id: `${platformId}-jup-asr-3`,
  claimLink: 'https://vote.jup.ag/asr',
  image: platformImage,
  emitterLink: platformWebsite,
  emitterName: 'Jupiter',
  claimStart: 1739466000000,
  claimEnd: 1743465600000,
  name: 'ASR #3',
};
export const jupuaryStatics: AirdropStatics = {
  id: `${platformId}-jupuary`,
  claimLink: 'https://jupuary.jup.ag',
  image: platformImage,
  emitterLink: platformWebsite,
  emitterName: 'Jupiter',
  name: 'Jupuary 2025',
};

export type AsrItems = Map<
  string,
  {
    label: string;
    decimals: number;
  }
>;
export type AsrConfig = {
  statics: AirdropStatics;
  items: AsrItems;
  api: (owner: string) => string;
};

export const asr1Config: AsrConfig = {
  statics: asr1Statics,
  items: new Map([
    [jupMint, { label: 'JUP', decimals: 6 }],
    [
      'ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq',
      { label: 'ZEUS', decimals: 6 },
    ],
    [
      'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk',
      { label: 'WEN', decimals: 5 },
    ],
    [
      'UPTx1d24aBWuRgwxVnFmX4gNraj3QGFzL3QqBgxtWQG',
      { label: 'UPT', decimals: 9 },
    ],
    [
      'SHARKSYJjqaNyxVfrpnBN9pjgkhwDhatnMyicWPnr1s',
      { label: 'SHARK', decimals: 6 },
    ],
  ]),
  api: (owner: string) =>
    `https://worker.jup.ag/jup-asr-july-2024-claim-proof/${owner}`,
};

export const asr2Config: AsrConfig = {
  statics: asr2Statics,
  items: new Map([
    [jupMint, { label: 'JUP', decimals: 6 }],
    [
      'CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu',
      { label: 'CLOUD', decimals: 9 },
    ],
  ]),
  api: (owner: string) =>
    `https://worker.jup.ag/asr-claim-proof/${owner}?asrTimeline=oct-2024&mints=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN%2CCLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu`,
};

export const asr3Config: AsrConfig = {
  statics: asr3Statics,
  items: new Map([
    [jupMint, { label: 'JUP', decimals: jupDecimals }],
    [dbrMint, { label: 'DBR', decimals: dbrDecimals }],
  ]),
  api: (owner: string) =>
    `https://worker.jup.ag/asr-claim-proof/${owner}?asrTimeline=jan-2025&mints=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN%2CDBRiDgJAMsM95moTzJs7M9LnkGErpbv9v6CUR1DXnUu5`,
};
