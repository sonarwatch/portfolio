import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'banx';
export const platform: Platform = {
  id: platformId,
  name: 'Banx',
  image: 'https://sonar.watch/img/platforms/banx.png',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  // website: 'https://myplatform.com',
  // twitter: 'https://twitter.com/myplatform',
};

export const banxPid = new PublicKey(
  '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt'
);
export const banxMint = 'BANXbTpN8U2cU41FjPxe2Ti37PiT5cCxLUKDQZuJeMMR';
export const banxDecimals = 9;
export const banxApiUrl = 'https://api.banx.gg/tokenStake/v2?walletPubkey=';
