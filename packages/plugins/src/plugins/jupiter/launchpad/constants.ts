import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'jupiter-launchpad';
export const platform: Platform = {
  id: platformId,
  name: 'Jupiter Launchpad',
  image: 'https://sonar.watch/img/platforms/jupiter.webp',
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

export const merkleApi = 'https://worker.jup.ag/jup-claim-proof';

export type AirdropInfo = {
  mint: string;
  decimals: number;
  claimStarts?: number;
  claimUntilTs: number; // in milliseconds
  distributorProgram: string;
};
export const airdropsInfo: AirdropInfo[] = [
  {
    mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    decimals: 6,
    claimUntilTs: 1722430800000,
    distributorProgram: 'meRjbQXFNf5En86FXT2YPz1dQzLj4Yb3xK8u1MVgqpb',
  },
  {
    mint: 'ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq',
    decimals: 6,
    claimUntilTs: 1713445200000,
    distributorProgram: 'DiSLRwcSFvtwvMWSs7ubBMvYRaYNYupa76ZSuYLe6D7j',
  },
  {
    mint: 'TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6',
    decimals: 9,
    claimUntilTs: 1728086400000,
    distributorProgram: 'DiSLRwcSFvtwvMWSs7ubBMvYRaYNYupa76ZSuYLe6D7j',
  },
  {
    mint: 'SHARKSYJjqaNyxVfrpnBN9pjgkhwDhatnMyicWPnr1s',
    decimals: 6,
    claimUntilTs: 1714435200000,
    distributorProgram: 'DiSLRwcSFvtwvMWSs7ubBMvYRaYNYupa76ZSuYLe6D7j',
  },
  {
    mint: 'UPTx1d24aBWuRgwxVnFmX4gNraj3QGFzL3QqBgxtWQG',
    decimals: 9,
    claimUntilTs: 1719878400000,
    claimStarts: 1717077600000,
    distributorProgram: 'DiSLRwcSFvtwvMWSs7ubBMvYRaYNYupa76ZSuYLe6D7j',
  },
];
