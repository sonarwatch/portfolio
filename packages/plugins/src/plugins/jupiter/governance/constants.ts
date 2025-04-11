import { AirdropStatics } from '../../../AirdropFetcher';
import { dbrDecimals, dbrMint } from '../../debridge/constants';
import { jupApiParams, jupDecimals, jupMint } from '../constants';

export const platformId = 'jupiter-governance';
const platformImage = 'https://sonar.watch/img/platforms/jupiterdao.webp';
const platformWebsite = 'https://vote.jup.ag/';

export const jupDisProgram = 'Dis2TfkFnXFkrtvAktEkw37sdb7qwJgY6H7YZJwk51wK';

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
export const asr4Statics: AirdropStatics = {
  id: `${platformId}-jup-asr-4`,
  claimLink: 'https://vote.jup.ag/asr',
  image: platformImage,
  emitterLink: platformWebsite,
  emitterName: 'Jupiter',
  claimStart: 1744213500000,
  claimEnd: 1751328000000,
  name: 'ASR #4',
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
  distributorProgram?: string;
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
    `https://worker.jup.ag/jup-asr-july-2024-claim-proof/${owner}?${
      jupApiParams ?? ''
    }`,
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
    `https://worker.jup.ag/asr-claim-proof/${owner}?asrTimeline=oct-2024&mints=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN%2CCLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu&${
      jupApiParams ?? ''
    }`,
};

export const asr3Config: AsrConfig = {
  statics: asr3Statics,
  items: new Map([
    [jupMint, { label: 'JUP', decimals: jupDecimals }],
    [dbrMint, { label: 'DBR', decimals: dbrDecimals }],
  ]),
  api: (owner: string) =>
    `https://worker.jup.ag/asr-claim-proof/${owner}?asrTimeline=jan-2025&mints=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN%2CDBRiDgJAMsM95moTzJs7M9LnkGErpbv9v6CUR1DXnUu5&${
      jupApiParams ?? ''
    }`,
};

export const asr4Config: AsrConfig = {
  statics: asr4Statics,
  items: new Map([[jupMint, { label: 'JUP', decimals: jupDecimals }]]),
  api: (owner: string) =>
    `https://worker.jup.ag/asr-claim-proof/${owner}?asrTimeline=apr-2025&mints=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN&${
      jupApiParams ?? ''
    }`,
  distributorProgram: 'DiS3nNjFVMieMgmiQFm6wgJL7nevk4NrhXKLbtEH1Z2R',
};
