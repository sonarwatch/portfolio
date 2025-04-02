import { PublicKey } from '@solana/web3.js';

export const platformId = 'futarchy';
export const metaMint = 'METADDFL6wWMWEoKTFJwcThTbUmtarRJZjRpzUvkxhr';
export const daoPid = new PublicKey(
  'autoQP9RmUNkzzKRXsMkWicDVZ3h29vvyMDcAYjCxxg'
);

type DaoInfo = {
  name: string;
  tokenName: string;
};

export const daoNameById: Map<string, DaoInfo> = new Map([
  [
    'CNMZgxYsQpygk8CLN9Su1igwXX2kHtcawaNAGuBPv3G9',
    { name: 'MetaDAO ', tokenName: 'META' },
  ],
  [
    '5vVCYQHPd8o3pGejYWzKZtnUSdLjXzDZcjZQxiFumXXx',
    { name: 'Drift ', tokenName: 'DRIFT' },
  ],
  [
    'ofvb3CPvEyRfD5az8PAqW6ATpPqVBeiB5zBnpPR5cgm',
    { name: 'Future ', tokenName: 'FUTURE' },
  ],
  [
    '9TKh2yav4WpSNkFV2cLybrWZETBWZBkQ6WB6qV9Nt9dJ',
    { name: "Dean's List ", tokenName: 'DEAN' },
  ],
]);
