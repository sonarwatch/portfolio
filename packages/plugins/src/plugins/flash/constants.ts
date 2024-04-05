import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'flash';
export const platform: Platform = {
  id: platformId,
  name: 'FlashTrade',
  image: 'https://sonar.watch/img/platforms/flash.png',
  defiLlamaId: 'flashtrade', // from https://defillama.com/docs/api
  website: 'https://beast.flash.trade/',
  twitter: 'https://twitter.com/FlashTrade_',
};

export const flashPid = new PublicKey(
  'FLASH6Lo6h3iasJKWDs2F8TkW2UKf3s15C8PMGuVfgBn'
);

export const poolsPkeys = [
  new PublicKey('HfF7GCcEc76xubFCHLLXRdYcgRzwjEPdfKWqzRS8Ncog'),
  new PublicKey('KwhpybQPe9xuZFmAfcjLHj3ukownWex1ratyascAC1X'),
  new PublicKey('D6bfytnxoZBSzJM7fcixg5sgWJ2hj8SbwkPvb2r8XpbH'),
];

export const marketsKey = 'markets';
