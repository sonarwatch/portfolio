import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropConfig } from './types';
import { platformId as kaminoPlatformId } from '../../kamino/constants';

export const platformId = 'jupiter-launchpad';
const platformImage = 'https://sonar.watch/img/platforms/jupiter.webp';
export const platform: Platform = {
  id: platformId,
  name: 'Jupiter Launchpad',
  image: platformImage,
  website: 'https://lfg.jup.ag/',
  twitter: 'https://twitter.com/JupiterExchange',
  description: 'Ultimate decentralised distribution stack',
};

export const voteProgramId = new PublicKey(
  'voTpe3tHQ7AjQHMapgSue2HJFAh2cGsdokqN3XqmVSj'
);
export const lockerPubkey = new PublicKey(
  'CVMdMd79no569tjc5Sq7kzz8isbfCcFyBS5TLGsrZ5dN'
);
export const jupMint = 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN';
export const jupDecimals = 6;

export const lfgApiBaseUrl = 'https://worker.jup.ag/jup-claim-proof';
export const lfgDisProgram = 'DiSLRwcSFvtwvMWSs7ubBMvYRaYNYupa76ZSuYLe6D7j';

export const airdropConfigs: AirdropConfig[] = [
  {
    mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    decimals: 6,
    distributorProgram: 'meRjbQXFNf5En86FXT2YPz1dQzLj4Yb3xK8u1MVgqpb',
    label: 'JUP',
    platformId,
    getApiPath: (owner: string) =>
      `${lfgApiBaseUrl}/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/${owner}`,
    statics: {
      claimStart: 1706659200000,
      claimEnd: 1722430800000,
      id: `jupiter-exchange-s1`,
      name: 'S1',
      emitterName: 'Jupiter',
      emitterLink: 'https://jup.ag/',
      claimLink: 'https://lfg.jup.ag/jup',
      image: platformImage,
    },
  },
  {
    mint: 'ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq',
    decimals: 6,
    distributorProgram: lfgDisProgram,
    label: 'ZEUS',
    platformId,
    getApiPath: (owner: string) =>
      `${lfgApiBaseUrl}/ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq/${owner}`,
    statics: {
      claimStart: 1712235600000,
      claimEnd: 1713445200000,
      id: 'zeus-lfg',
      emitterName: 'Zeus',
      emitterLink: 'https://zeusnetwork.xyz/',
      claimLink: 'https://lfg.jup.ag/zeus',
      image:
        'https://sonarwatch.github.io/portfolio/assets/images/platforms/zeus.webp',
    },
  },
  {
    mint: 'TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6',
    decimals: 9,
    distributorProgram: lfgDisProgram,
    label: 'TNSR',
    platformId,
    getApiPath: (owner: string) =>
      `${lfgApiBaseUrl}/TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6/${owner}`,
    statics: {
      claimStart: 1712534400000,
      claimEnd: 1728086400000,
      id: 'tensor-lfg',
      emitterName: 'Tensor',
      emitterLink: 'https://www.tensor.trade/',
      claimLink: 'https://claim.jup.ag/tnsr',
      image:
        'https://sonarwatch.github.io/portfolio/assets/images/platforms/tensor.webp',
    },
  },
  {
    mint: 'SHARKSYJjqaNyxVfrpnBN9pjgkhwDhatnMyicWPnr1s',
    decimals: 6,
    distributorProgram: lfgDisProgram,
    label: 'SHARKY',
    platformId,
    getApiPath: (owner: string) =>
      `${lfgApiBaseUrl}/SHARKSYJjqaNyxVfrpnBN9pjgkhwDhatnMyicWPnr1s/${owner}`,
    statics: {
      claimStart: 1713225600000,
      claimEnd: 1714435200000,
      id: 'sharky-lfg',
      emitterName: 'Sharky',
      emitterLink: 'https://sharky.fi/',
      claimLink: 'https://lfg.jup.ag/sharky',
      image:
        'https://sonarwatch.github.io/portfolio/assets/images/platforms/sharky.webp',
    },
  },
  {
    mint: 'UPTx1d24aBWuRgwxVnFmX4gNraj3QGFzL3QqBgxtWQG',
    decimals: 9,
    distributorProgram: lfgDisProgram,
    label: 'UPT',
    platformId,
    getApiPath: (owner: string) =>
      `${lfgApiBaseUrl}/UPTx1d24aBWuRgwxVnFmX4gNraj3QGFzL3QqBgxtWQG/${owner}`,
    statics: {
      claimStart: 1717077600000,
      claimEnd: 1719878400000,
      id: 'uprock-lfg',
      emitterName: 'Uprock',
      emitterLink: 'https://uprock.com/',
      claimLink: 'https://lfg.jup.ag/uprock',
      image:
        'https://sonarwatch.github.io/portfolio/assets/images/platforms/uprock.webp',
    },
  },
  {
    mint: 'KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS',
    decimals: 6,
    distributorProgram: 'KdisqEcXbXKaTrBFqeDLhMmBvymLTwj9GmhDcdJyGat',
    label: 'KMNO',
    platformId: kaminoPlatformId,
    getApiPath: (owner: string) =>
      `https://api.kamino.finance/distributor/user/${owner}`,
    statics: {
      claimStart: 1724158800000,
      claimEnd: 1733130000000,
      id: 'kamino-s2',
      emitterName: 'Kamino',
      emitterLink: 'https://app.kamino.finance/',
      claimLink: 'https://app.kamino.finance/season-2-airdrop',
      image:
        'https://sonarwatch.github.io/portfolio/assets/images/platforms/kamino.webp',
      name: 'S2',
    },
  },
  {
    mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    decimals: 6,
    distributorProgram: 'DiS3nNjFVMieMgmiQFm6wgJL7nevk4NrhXKLbtEH1Z2R',
    label: 'JUP',
    platformId,
    getApiPath: (owner: string) =>
      `https://jupuary-api.jup.ag/claim-proof-2025/${owner}`,
    statics: {
      claimStart: 1737547200000,
      claimEnd: 1745323200000,
      id: 'jupiter-governance-jupuary-2025',
      emitterName: 'Jupiter',
      emitterLink: 'https://jup.ag/',
      claimLink: 'https://jupuary.jup.ag/',
      image: platformImage,
      name: 'Jupuary 2025',
    },
  },
];
