import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'accessprotocol';
export const acsMint = '5MAYDfq5yxtudAhtfyuMBuHZjgAbaS9tbEyEQYAhDS5y';
export const platform: Platform = {
  id: platformId,
  name: 'Access Protocol',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/accessprotocol.webp',
  twitter: 'https://twitter.com/AccessProtocol',
  website: 'https://hub.accessprotocol.co',
  defiLlamaId: 'access-protocol',
  description:
    'Access is a content and service monetization protocol offering incentivized subscriptions by staking the native ACS token.',
  discord: 'https://discord.com/invite/access-protocol-1001837380044587118',
  documentation: 'https://docs.accessprotocol.co/guide',
  github: 'https://github.com/Access-Labs-Inc',
  tokens: [acsMint],
};
export const stakePid = new PublicKey(
  '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup'
);
export const acsDecimals = 6;
