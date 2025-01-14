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
export const poolAddressPrefix = `${platformId}-pool-address`;
export const marketPrefix = `${platformId}-market`;
export const spoolsPrefix = `${platformId}-spoolsmarket`;
export const sCoinNamePrefix = `${platformId}-scoin-names`;
export const marketCoinNamePrefix = `${platformId}-market-coin-names`;
export const borrowIncentivePoolsPrefix = `${platformId}-borrow-incentive-pools`;

export const addressEndpoint =
  'https://sui.apis.scallop.io/addresses/675c65cd301dd817ea262e76';
export const poolAddressEndpoint =
  'https://sdk.api.scallop.io/api/market/coinPoolInfo';

export const addressKey = `${platformId}-address-key`;
export const poolAddressKey = `${platformId}-pool-address-key`;
export const marketKey = `${platformId}-market-key`;
export const spoolsKey = `${platformId}-spoolsmarket-key`;
export const marketCoinNameKey = `${platformId}-market-coin-names-key`;
export const borrowIncentivePoolsKey = `${platformId}-borrow-incentive-pools-key`;

export const sPoolAccountType = `0xe87f1b2d498106a2c61421cec75b7b5c5e348512b0dc263949a0e7a3c256571a::spool_account::SpoolAccount`;
export const veScaKeyType =
  '0xcfe2d87aa5712b67cad2732edb6a2201bfdf592377e5c0968b7cb02099bd8e21::ve_sca::VeScaKey';

const scallopPackageId =
  '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf';
export const marketCoinType = `${scallopPackageId}::reserve::MarketCoin`;
export const obligationKeyType = `${scallopPackageId}::obligation::ObligationKey`;

export const baseIndexRate = 1_000_000_000;
export const scaAddress =
  '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA';
export const scaDecimals = 9;

export const sscaAddress =
  '0x5ca17430c1d046fae9edeaa8fd76c7b4193a00d764a0ecfa9418d733ad27bc1e::scallop_sca::SCALLOP_SCA';
export const sscaDecimals = 9;

export const cnyTableId =
  '0xbfbbbdf1fe9b70cdd1ebd1444ca273000177f81a405935f6007b7727d2ff90c2';
export const christmasTableId =
  '0x93f3f6fbd6da68e1ddf09a81553af0f4e87de2efddd1e3ec32a53c00f90c1cfd';
export const airdropUrl =
  'https://airdrop.apis.scallop.io/cny-campaign/claim-signature/';
