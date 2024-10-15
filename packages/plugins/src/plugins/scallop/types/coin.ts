import { CoinMetadata } from '@mysten/sui/client';
import { coinNames, marketCoinNames, scoinNames } from '../constants';

export type MarketCoinNames = (typeof marketCoinNames)[number];
export type PoolCoinNames = (typeof coinNames)[number];
export type SCoinNames = (typeof scoinNames)[number];

export type CoinTypeMetadata = {
  coinType: string;
  metadata: CoinMetadata | null;
};

type SCoinToCoinNameType = { [T in SCoinNames]: PoolCoinNames };
type SCoinTypesMapType = { [T in SCoinNames]: string };

export const sCoinToCoinName: SCoinToCoinNameType = {
  scallop_sui: 'sui',
  scallop_cetus: 'cetus',
  scallop_sca: 'sca',
  scallop_wormhole_usdc: 'wusdc',
  scallop_wormhole_usdt: 'wusdt',
  scallop_wormhole_eth: 'weth',
  scallop_wormhole_btc: 'wbtc',
  scallop_wormhole_sol: 'wsol',
  scallop_af_sui: 'afsui',
  scallop_ha_sui: 'hasui',
  scallop_v_sui: 'vsui',
  scallop_usdc: 'usdc',
};

export const sCoinTypesMap: SCoinTypesMapType = {
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
  scallop_usdc:
    '0x854950aa624b1df59fe64e630b2ba7c550642e9342267a33061d59fb31582da5::scallop_usdc::SCALLOP_USDC',
  scallop_wormhole_btc:
    '0x2cf76a9cf5d3337961d1154283234f94da2dcff18544dfe5cbdef65f319591b5::scallop_wormhole_btc::SCALLOP_WORMHOLE_BTC',
  scallop_wormhole_sol:
    '0x1392650f2eca9e3f6ffae3ff89e42a3590d7102b80e2b430f674730bc30d3259::scallop_wormhole_sol::SCALLOP_WORMHOLE_SOL',
} as const;

export type SCoinTypeValue = (typeof sCoinTypesMap)[SCoinNames];

export const sCoinTypeToCoinTypeMap: { [T in SCoinTypeValue]: string } = {
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
  [sCoinTypesMap.scallop_wormhole_btc]:
    '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN',
  [sCoinTypesMap.scallop_wormhole_sol]:
    '0xb7844e289a8410e50fb3ca48d69eb9cf29e27d223ef90353fe1bd8e27ff8f3f8::coin::COIN',
  [sCoinTypesMap.scallop_af_sui]:
    '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI',
  [sCoinTypesMap.scallop_ha_sui]:
    '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI',
  [sCoinTypesMap.scallop_v_sui]:
    '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT',
  [sCoinTypesMap.scallop_usdc]:
    '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
} as const;

export const wormholeCoinTypeToSymbolMap: Record<string, SCoinTypeValue> = {
  [sCoinTypeToCoinTypeMap[sCoinTypesMap.scallop_wormhole_usdc]]: 'wUSDC',
  [sCoinTypeToCoinTypeMap[sCoinTypesMap.scallop_wormhole_usdt]]: 'wUSDT',
  [sCoinTypeToCoinTypeMap[sCoinTypesMap.scallop_wormhole_eth]]: 'wETH',
  [sCoinTypeToCoinTypeMap[sCoinTypesMap.scallop_wormhole_btc]]: 'wBTC',
  [sCoinTypeToCoinTypeMap[sCoinTypesMap.scallop_wormhole_sol]]: 'wSOL',
};
