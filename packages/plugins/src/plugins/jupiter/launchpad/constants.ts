import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropConfig } from './types';

export const platformId = 'jupiter-launchpad';
const platformImage = 'https://sonar.watch/img/platforms/jupiter.webp';
export const platform: Platform = {
  id: platformId,
  name: 'Jupiter Launchpad',
  image: platformImage,
  website: 'https://lfg.jup.ag/',
  twitter: 'https://twitter.com/JupiterExchange',
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
      id: 'lfg-jup-s1',
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
      id: 'lfg-zeus',
      emitterName: 'Zeus',
      emitterLink: 'https://zeusnetwork.xyz/',
      claimLink: 'https://lfg.jup.ag/zeus',
      image: 'https://sonar.watch/img/platforms/zeus.webp',
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
      id: 'lfg-tensor',
      emitterName: 'Tensor',
      emitterLink: 'https://www.tensor.trade/',
      claimLink: 'https://claim.jup.ag/tnsr',
      image: 'https://sonar.watch/img/platforms/tensor.webp',
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
      id: 'lfg-sharky',
      emitterName: 'Sharky',
      emitterLink: 'https://sharky.fi/',
      claimLink: 'https://lfg.jup.ag/sharky',
      image: 'https://sonar.watch/img/platforms/sharky.webp',
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
      id: 'lfg-uprock',
      emitterName: 'Uprock',
      emitterLink: 'https://uprock.com/',
      claimLink: 'https://lfg.jup.ag/uprock',
      image: 'https://sonar.watch/img/platforms/uprock.webp',
    },
  },
];
