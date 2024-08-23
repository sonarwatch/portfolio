import { CoinMetadata } from '@mysten/sui.js/client';
import { COIN_NAMES, MARKET_COIN_NAMES, SCOIN_NAMES, sCoinTypesMap } from '../constants';

export type MarketCoinNames = (typeof MARKET_COIN_NAMES)[number];
export type PoolCoinNames = (typeof COIN_NAMES)[number];
export type sCoinNames = (typeof SCOIN_NAMES)[number];
export type AllCoinNames = PoolCoinNames | MarketCoinNames;

export type CoinTypeMetadata = {
  coinType: string;
  metadata: CoinMetadata | null;
};

export type sCoinToCoinNameType = {[T in sCoinNames]: PoolCoinNames}

export const sCoinToCoinName: sCoinToCoinNameType = {
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
