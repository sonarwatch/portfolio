import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'flash';
export const platform: Platform = {
  id: platformId,
  name: 'FlashTrade',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/flash.webp',
  defiLlamaId: 'flashtrade', // from https://defillama.com/docs/api
  website: 'https://beast.flash.trade/',
  twitter: 'https://twitter.com/FlashTrade_',
  documentation: 'https://docs.flash.trade/flash-trade',
  github: 'https://github.com/flash-trade',
  discord: 'https://discord.com/invite/HqYDWnMP6J',
  description: 'Trade Perpetuals with instant fills and on demand liquidity.',
};

export const flashPid = new PublicKey(
  'FLASH6Lo6h3iasJKWDs2F8TkW2UKf3s15C8PMGuVfgBn'
);
export const flashPerpetuals = new PublicKey(
  '7DWCtB5Z8rPiyBMKUwqyC95R9tJpbhoQhLM9LbK3Z5QZ'
);

export const poolsPkeys = [
  new PublicKey('HfF7GCcEc76xubFCHLLXRdYcgRzwjEPdfKWqzRS8Ncog'),
  new PublicKey('KwhpybQPe9xuZFmAfcjLHj3ukownWex1ratyascAC1X'),
  new PublicKey('D6bfytnxoZBSzJM7fcixg5sgWJ2hj8SbwkPvb2r8XpbH'),
  new PublicKey('6HukhSeVVLQekKaGJYkwztBacjhKLKywVPrmcvccaYMz'),
  new PublicKey('DP1FnZjWzDjSMQA64BcMzUdpDpyAQ6723d5fpX4yTk5G'),
  new PublicKey('F8qWvHm5F288VodQ7zGLhnrbbRR3zDbae6aNE53HQ98f'),
  new PublicKey('Crk3yzGpPCt9thXmV9wCkBM9nBq8EHhBct71ArkKY9wA'),
];

export const custodiesKey = 'custodies';
export const marketsKey = 'markets';
export const poolsKey = 'pools';
