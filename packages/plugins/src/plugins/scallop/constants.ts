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
export const scoinPrefix = `${platformId}-scoin`;
export const poolsPrefix = `${platformId}-pools`;
export const spoolsPrefix = `${platformId}-spoolsmarket`;

export const addressEndpoint =
  'https://sui.apis.scallop.io/addresses/664dfe22898c36c159e28bc8';
export const addressKey = 'scallop-address-key';
export const marketKey = 'scallop-market-key';
export const poolsKey = 'scallop-pools-key';
export const scoinKey = 'scallop-scoin-key';
export const spoolsKey = 'scallop-spoolsmarket-key';

export const SPOOL_ACCOUNT_TYPE = `0xe87f1b2d498106a2c61421cec75b7b5c5e348512b0dc263949a0e7a3c256571a::spool_account::SpoolAccount`;
export const VE_SCA_KEY_TYPE =
  '0xcfe2d87aa5712b67cad2732edb6a2201bfdf592377e5c0968b7cb02099bd8e21::ve_sca::VeScaKey';
  
const PROTOCOL_OBJECT_ID =
  '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf';
export const MARKET_COIN_TYPE = `${PROTOCOL_OBJECT_ID}::reserve::MarketCoin`;
export const OBLIGATION_KEY_TYPE = `${PROTOCOL_OBJECT_ID}::obligation::ObligationKey`;

export const baseIndexRate = 1_000_000_000;
export const scaAddress =
  '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA';
export const scaDecimals = 9;

export const CNY_TABLE_ID =
  '0xbfbbbdf1fe9b70cdd1ebd1444ca273000177f81a405935f6007b7727d2ff90c2';
export const AIRDROP_URL =
  'https://airdrop.apis.scallop.io/cny-campaign/claim-signature/';

export const SCOIN_NAMES = [
  'scallop_sui',
  'scallop_cetus',
  'scallop_sca',
  'scallop_wormhole_usdc',
  'scallop_wormhole_usdt',
  'scallop_wormhole_eth',
  'scallop_af_sui',
  'scallop_ha_sui',
  'scallop_v_sui',
] as const;

export const COIN_NAMES = [
  'eth',
  'btc',
  'usdc',
  'usdt',
  'sui',
  'apt',
  'sol',
  'cetus',
  'sca',
  'afsui',
  'hasui',
  'vsui',
] as const;

export const MARKET_COIN_NAMES = [
  'seth',
  'sbtc',
  'susdc',
  'susdt',
  'ssui',
  'sapt',
  'ssol',
  'scetus',
  'ssca',
  'safsui',
  'shasui',
  'svsui',
] as const;