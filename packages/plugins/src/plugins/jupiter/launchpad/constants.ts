import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const jupLaunchpadPlatformId = 'jupiter-launchpad';
export const jupLaunchpadPlatform: Platform = {
  id: jupLaunchpadPlatformId,
  name: 'Jupiter Launchpad',
  image: 'https://sonar.watch/img/platforms/jupiter.png',
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

export const merkleDistributorPid = new PublicKey(
  'meRjbQXFNf5En86FXT2YPz1dQzLj4Yb3xK8u1MVgqpb'
);
export const merkleApi = 'https://worker.jup.ag/jup-claim-proof';

export type AirdropInfo = {
  mint: string;
  decimals: number;
  claimUntilTs: number; // in milliseconds
};
export const airdropsInfo: AirdropInfo[] = [
  {
    mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    decimals: 6,
    claimUntilTs: 1722430800000,
  },
  {
    mint: 'ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq',
    decimals: 6,
    claimUntilTs: 1713445200000,
  },
  {
    mint: 'TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6',
    decimals: 9,
    claimUntilTs: 1728086400000,
  },
];
