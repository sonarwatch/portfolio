import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'accessprotocol';
export const platform: Platform = {
  id: platformId,
  name: 'Access Protocol',
  image: 'https://sonar.watch/img/platforms/accessprotocol.png',
  twitter: 'https://twitter.com/AccessProtocol',
  website: 'https://hub.accessprotocol.co',
  // defiLlamaId: 'nothing yet',
};
export const stakePid = new PublicKey(
  '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup'
);
export const acsMint = '5MAYDfq5yxtudAhtfyuMBuHZjgAbaS9tbEyEQYAhDS5y';
export const acsDecimals = 6;
