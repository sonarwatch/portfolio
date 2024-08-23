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

export const sCoinTypesMap = {
  scallop_sui:
    '0xaafc4f740de0dd0dde642a31148fb94517087052f19afb0f7bed1dc41a50c77b::scallop_sui::SCALLOP_SUI',
  scallop_cetus:
    '0xea346ce428f91ab007210443efcea5f5cdbbb3aae7e9affc0ca93f9203c31f0c::scallop_cetus::SCALLOP_CETUS',
  scallop_sca:
    '0x5ca17430c1d046fae9edeaa8fd76c7b4193a00d764a0ecfa9418d733ad27bc1e::scallop_sca::SCALLOP_SCA',
  scallop_wormhole_usdc:
    '0xad4d71551d31092230db1fd482008ea42867dbf27b286e9c70a79d2a6191d58d::scallop_wormhole_usdc::SCALLOP_WORMHOLE_USDC',
  scallop_wormhole_usdt:
    '0xe6e5a012ec20a49a3d1d57bd2b67140b96cd4d3400b9d79e541f7bdbab661f95::scallop_wormhole_usdt::SCALLOP_WORMHOLE_USDT',
  scallop_wormhole_eth:
    '0x67540ceb850d418679e69f1fb6b2093d6df78a2a699ffc733f7646096d552e9b::scallop_wormhole_eth::SCALLOP_WORMHOLE_ETH',
  scallop_af_sui:
    '0x00671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::scallop_af_sui::SCALLOP_AF_SUI',
  scallop_ha_sui:
    '0x9a2376943f7d22f88087c259c5889925f332ca4347e669dc37d54c2bf651af3c::scallop_ha_sui::SCALLOP_HA_SUI',
  scallop_v_sui:
    '0xe1a1cc6bcf0001a015eab84bcc6713393ce20535f55b8b6f35c142e057a25fbe::scallop_v_sui::SCALLOP_V_SUI',
} as const;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type sCoinNames = (typeof SCOIN_NAMES)[number];

export type CoinNames = (typeof COIN_NAMES)[number];

export const sCoinToCoinName: { [T in sCoinNames]: CoinNames } = {
  scallop_sui: 'sui',
  scallop_cetus: 'cetus',
  scallop_sca: 'sca',
  scallop_wormhole_usdc: 'usdc',
  scallop_wormhole_usdt: 'usdt',
  scallop_wormhole_eth: 'eth',
  scallop_af_sui: 'afsui',
  scallop_ha_sui: 'hasui',
  scallop_v_sui: 'vsui',
};

export type sCoinTypeValue = (typeof sCoinTypesMap)[sCoinNames];

export const sCoinTypeToCoinTypeMap: { [T in sCoinTypeValue]: string } = {
  [sCoinTypesMap.scallop_sui]:
    '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
  [sCoinTypesMap.scallop_cetus]:
    '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
  [sCoinTypesMap.scallop_sca]:
    '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
  [sCoinTypesMap.scallop_wormhole_usdc]:
    '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
  [sCoinTypesMap.scallop_wormhole_usdt]:
    '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
  [sCoinTypesMap.scallop_wormhole_eth]:
    '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN',
  [sCoinTypesMap.scallop_af_sui]:
    '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI',
  [sCoinTypesMap.scallop_ha_sui]:
    '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI',
  [sCoinTypesMap.scallop_v_sui]:
    '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT',
} as const;
