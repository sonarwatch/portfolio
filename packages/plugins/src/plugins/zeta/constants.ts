import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const zexMint = 'ZEXy1pqteRu3n13kdyh4LwPQknkFk3GzmMYMuNadWPo';
export const platformId = 'zeta';
export const platform: Platform = {
  id: platformId,
  name: 'Zeta',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/zeta.webp',
  defiLlamaId: 'zeta',
  website: 'https://www.zeta.markets/',
  twitter: 'https://x.com/ZetaMarkets',
  documentation: 'https://docs.zeta.markets/',
  tokens: [zexMint],
  telegram: 'https://t.me/realzetamarkets',
  discord: 'https://discord.gg/Xn9HCJaDZd',
  github: 'https://github.com/zetamarkets',
  description: 'Zeta Markets is the premier derivatives protocol on Solana.',
};

export const programId = new PublicKey(
  'ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD'
);
export const graphqlApi = 'https://api-gql.zeta.markets/graphql';

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://token.zeta.markets/',
  emitterLink: 'https://www.zeta.markets/',
  emitterName: 'Zeta',
  id: 'zeta-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/zeta.webp',
  claimStart: 1719475200000,
  claimEnd: 1727251200000,
};

export const zexDecimals = 6;
export const distributorPid = '4JSALTb4QbipG7NNLryAFJg4y8X5C1ELErSncsVMA3gZ';
export const distributors = [
  'Ena5PXG5QHAFqxLHueKW8fc74kGSghBVL2UDHyrUnFc1',
  'CLPmtotgeWyYqwEQrV3yXWqNdk6aSdj9f86gQHnHVEBo',
  '4TqxRLvWyA3i8u18iG97ocuAY6wKL2mFLc1Qogd6moor',
  '3rLQ4wYXhi4XxBvoeZXdsvCC5HD1Ei9xPZhAtUzNiPZf',
  'Csq8eYrtntuDEJ7YFG3jXuQ6SmMS9taxPbic7UZUYFNX',
  'Do44U3Nbi4Y1vdjB3XCNa1chJCpFgYvBN1reCx385wQ1',
  'DWpLKpu8xV8ndXAAHMbjgyeRUwUYAxtYhtwJh8Dssd2d',
  '7BUBEu7jE2JazSFEzGN8oP949yq6z6xZFK1uRQu6hG88',
  '3FT4V9KqAWPkpXkXS7RRbPR3kK2H6acuP92LFqX73FL6',
  'E1vJ43iC3ugkwwQK7xW5Zz9wRNkSYm4GZALoXTETv4t2',
  'HwBy6DAP2y1usiaWDCbiPQv5dtPLEZYenTUV3FCu7imG',
  'CQ5Fi2EcGwVScFjFN8hPvaVDmxj7MarWoqyziD6Wcept',
  'CMYgPw7cYAMtmxxWGiGLTeV8T6QFyh3nui7mkebh44LM',
  '5jK9Aimc3ZxqL57cwvsHGJx3MR1dZHuXBwYBb7QCHVQD',
  'GdNKKg8TXZQbhFuUNkSGr5o3vuhnrvD3rbApbmipxtpG',
  'G9Ty1XbwuagpUEcsexNV6nP2YmmCt816GS5sGwMU11WF',
  '2XXw2tHcH59YtLJwfaD4GdhkARGww6RBheyviUsFWEcf',
  'FxTYEUHqgc478su5Dge3FtSjbuByxWbYP9Dws5nLeMwW',
  '4FaCZyR1vSgsR8nFgXf8x1f81rWg8gyjHKmEXwFjt129',
  'A4c6Mi9kqNyrNLUjRPiTPhnL9Yx63sXA5pygPuEoAh4M',
  '5GnFHWaDAKYaf2T2gahmkzxpgTUNt4ddDhy65NGq2PT',
  '4DBsW2Qdh39x1cb5jQ5mASKeSKjrZt4bCMkGV9ekxpuu',
  'GdqgRTuyhVDjv8GbPy3kC7YQzMbT3ffANpCXK7ie243u',
  'CFAejLQynRFa3mnWYPzVeKMSw66t5TsqKJuBheejif9E',
  '5gh3BM2KQzGevAEid4sAYrHd99uQCNjqM2ipkkZb178H',
  'JA7CKeJEq2p11Taqp9rJw8sMu9AWK29FiqjXuz8PJ2Av',
  'AiB7Vgdm2DsXFe8FXqA7pjjPRBpshk4MNnpubJQTRL8L',
  '5DvChKBPGYYS3VbbP1Pa7Qj7gUEwfbsRPrsARh6apPbn',
  'CNSWTtezkd7VwNc8bT4iLFedawHDgjBNVkkesVh2ciDK',
  '5yrdm62pK6L4nxBfJjb2n31ZBStdL2Za2Dj8xWjWwm4N',
  '5NveKpT8P41C8BgsEmGTRqCmZkWwjkaF5NC7WQ1jiBSd',
  '4npWCt7noK6FXceZ5FgLuMsa4P2sqCzsKATJR66t1orC',
  '8aTtdjE4v7HhiDgHAcS156vb1zvboCh1ukHLXa5AqBEk',
  'C12iWEzCdiyU1zL9VrJwFCW26XZTMmSwoJczc9ZrDuHo',
  '6o1ZexNBJnQCDXiWtJgDPkE4u5WndgUb1wKDjofRuWme',
];

export const stakingPid = new PublicKey(
  '4DUapvWZDDCkfWJpdwvX2QjwAE9Yq4wU8792RMMv7Csg'
);
