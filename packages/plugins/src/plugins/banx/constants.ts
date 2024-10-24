import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { BanxIDL } from './idl';

export const platformId = 'banx';
export const platform: Platform = {
  id: platformId,
  name: 'Banx',
  image: 'https://sonar.watch/img/platforms/banx.webp',
  defiLlamaId: 'banx', // from https://defillama.com/docs/api
  website: 'https://banx.gg/',
  twitter: 'https://twitter.com/banx_gg',
};

export const banxPid = new PublicKey(
  '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt'
);
export const banxMint = 'BANXbTpN8U2cU41FjPxe2Ti37PiT5cCxLUKDQZuJeMMR';
export const banxDecimals = 9;
export const banxApiUrl = 'https://api.banx.gg/staking/v2/info?walletPubkey=';

export const banxApiCollectionsUrl =
  'https://api.banx.gg/bonds/preview?isPrivate=false&getAll=true';

export const collectionsCacheKey = `${platformId}-collections`;
export const cachePrefix = `${platformId}`;

export const bondOfferDataSize = 208;
export const bondTradeTransactionV3DataSize = 336;

export const banxIdlItem = {
  programId: banxPid.toString(),
  idl: BanxIDL,
  idlType: 'anchor',
} as IdlItem;
