import { PublicKey } from '@solana/web3.js';
import { platformId as sanctumPlatformId } from '../sanctum/constants';
import { platformId as driftPlatformId } from '../drift/constants';

export const platformId = 'futarchy';
export const metaMint = 'METADDFL6wWMWEoKTFJwcThTbUmtarRJZjRpzUvkxhr';
export const daoPid = new PublicKey(
  'autoQP9RmUNkzzKRXsMkWicDVZ3h29vvyMDcAYjCxxg'
);
export const launchpadPid = new PublicKey(
  'AfJJJ5UqxhBKoE3grkKAZZsoXDE9kncbMKvqSHGsCNrE'
);
export const launchpadKey = 'launchpad';
type DaoInfo = {
  name: string;
  tokenName: string;
  platformId?: string;
  getLink?: (proposal: string) => string;
};

export const daoNameById: Map<string, DaoInfo> = new Map([
  [
    'CNMZgxYsQpygk8CLN9Su1igwXX2kHtcawaNAGuBPv3G9',
    { name: 'MetaDAO ', tokenName: 'META' },
  ],
  [
    '5vVCYQHPd8o3pGejYWzKZtnUSdLjXzDZcjZQxiFumXXx',
    {
      name: 'Drift ',
      tokenName: 'DRIFT',
      platformId: driftPlatformId,
      link: 'https://drift.foundation/vote',
    },
  ],
  [
    'ofvb3CPvEyRfD5az8PAqW6ATpPqVBeiB5zBnpPR5cgm',
    { name: 'Future ', tokenName: 'FUTURE' },
  ],
  [
    '9TKh2yav4WpSNkFV2cLybrWZETBWZBkQ6WB6qV9Nt9dJ',
    { name: "Dean's List ", tokenName: 'DEAN' },
  ],
  [
    'GVmi7ngRAVsUHh8REhKDsB2yNftJTNRt5qMLHDDCizov',
    {
      name: 'Sanctum ',
      tokenName: 'CLOUD',
      platformId: sanctumPlatformId,
      getLink: (proposal: string) =>
        `https://vote.sanctum.so/proposal/${proposal}`,
    },
  ],
  [
    '9RNQx6cnheD4tzvRCW5Mo1sTo72Vm6PbPj6SFC5aK4fy',
    { name: 'Marinade ', tokenName: 'MNDE' },
  ],
  [
    'B3PDBD7NCsJyxSdSDFEK38oNKZMBrgkg46TuqqkgAwPp',
    { name: 'Jito ', tokenName: 'JITO' },
  ],
  [
    '7XoddQu6HtEeHZowzCEwKiFJg4zR3BXUqMygvwPwSB1D',
    { name: 'ORE ', tokenName: 'ORE' },
  ],
  [
    '3LGGRzLrgwhEbEsNYBSTZc5MLve1bw3nDaHzzfJMQ1PG',
    { name: 'COAL ', tokenName: 'COAL' },
  ],
]);
