import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'scallop';
export const platform: Platform = {
  id: platformId,
  name: 'Scallop',
  image: `https://sonar.watch/img/platforms/${platformId}.webp`,
  defiLlamaId: 'parent#scallop',
  website: 'https://app.scallop.io/',
};

export const addressPrefix = `${platformId}-address`;
export const marketPrefix = `${platformId}-market`;
export const poolsPrefix = `${platformId}-pools`;
export const spoolsPrefix = `${platformId}-spoolsmarket`;

export const addressEndpoint =
  'https://sui.apis.scallop.io/addresses/664dfe22898c36c159e28bc8';
export const addressKey = 'scallop-address-key';
export const marketKey = 'scallop-market-key';
export const poolsKey = 'scallop-pools-key';
export const spoolsKey = 'scallop-spoolsmarket-key';

export const spoolAccountPackageId = `0xe87f1b2d498106a2c61421cec75b7b5c5e348512b0dc263949a0e7a3c256571a::spool_account::SpoolAccount`;
const PROTOCOL_OBJECT_ID =
  '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf';
export const marketCoinPackageId = `${PROTOCOL_OBJECT_ID}::reserve::MarketCoin`;
export const obligationKeyPackageId = `${PROTOCOL_OBJECT_ID}::obligation::ObligationKey`;
export const baseIndexRate = 1_000_000_000;
export const scaAddress =
  '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA';
export const scaDecimals = 9;

export const tableId =
  '0xbfbbbdf1fe9b70cdd1ebd1444ca273000177f81a405935f6007b7727d2ff90c2';
export const airdropUrl =
  'https://airdrop.apis.scallop.io/cny-campaign/claim-signature/';
