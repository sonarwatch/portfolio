import { Platform } from '@sonarwatch/portfolio-core';
import { Dex, VaultConfig } from './types/common';

export const platformId = 'kriya';
export const platform: Platform = {
  id: platformId,
  name: 'Kriya',
  image: 'https://sonar.watch/img/platforms/kriya.webp',
  defiLlamaId: 'parent#kriyadex', // from https://defillama.com/docs/api
  website: 'https://www.app.kriya.finance/',
  twitter: 'https://twitter.com/KriyaDEX',
};

export const vaultsPackageId =
  '0xc4ee7b00ea981402a6285b14ffa5dcd1ee7f97eb2a91df3bcc04fa88c56ac7d7';
export const farmsPackageId =
  '0x88701243d0445aa38c0a13f02a9af49a58092dfadb93af9754edb41c52f40085';
export const poolsV2PackageId =
  '0xa0eba10b173538c8fecca1dff298e488402cc9ff374f8a12ca7758eebe830b66';
export const clmmPoolPackageId =
  '0xf6c05e2d9301e6e91dc6ab6c3ca918f7d55896e1f1edd64adc0e615cde27ebf1';
export const lpPositionTypeV2 = `${poolsV2PackageId}::spot_dex::KriyaLPToken`;
export const clmmType = `${clmmPoolPackageId}::position::Position`;
export const vaultStakeReceipt =
  '0xba0dd78bdd5d1b5f02a689444522ea9a79e1bc4cd4d8e6a57b59f3fbcae5e978::farm::StakeReceipt';

export const vaultsInfoKey = 'vaultsInfos';
export const leverageVaultsInfoKey = 'leverageVaultsInfos';
export const farmsInfoKey = 'farmsInfos';

export const vaultsUrl =
  'https://88ob93rfva.execute-api.ap-southeast-1.amazonaws.com/release/vaults';
export const poolsUrl =
  'https://xd0ljetd33.execute-api.ap-southeast-1.amazonaws.com/release/pools';
export const leverageVaultsUrl =
  'https://4sacq88271.execute-api.ap-southeast-1.amazonaws.com/release/vaults';

export const vaultsInfo: VaultConfig[] = [
  {
    tokenType:
      '0xc4ee7b00ea981402a6285b14ffa5dcd1ee7f97eb2a91df3bcc04fa88c56ac7d7::kc_allweather_vt::KC_ALLWEATHER_VT',
    id: '0x5eb2f7e07e4fbe6ce47dd10dc040efd5c79228ed767d242c320571dcd7c5a976',
    underlyingPool:
      '0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630',
    underlyingDex: Dex.cetus,
  },
  {
    tokenType:
      '0x1e06cc1e491b434cd1be9f24e1f8a82f6fcb016f6fb87f0586b0fe57ecca6cbb::kc_navx_chopper_vt::KC_NAVX_CHOPPER_VT',
    id: '0xce23eccbba8e6fe0351a8d6e2f736929723ef0ada2ca9d3612557ac6bc423c87',
    underlyingPool:
      '0x0254747f5ca059a1972cd7f6016485d51392a3fde608107b93bbaebea550f703',
    underlyingDex: Dex.cetus,
  },
  {
    tokenType:
      '0x6d8c1becd365aaa5474a0642247b15189e1625f32104945749f1e8802b768d6d::kc_degen_vt::KC_DEGEN_VT',
    id: '0x264c3b7de2abf0df2871bc0486bfab001f88b76c865bbdda377cd583b633c17a',
    underlyingPool:
      '0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630',
    underlyingDex: Dex.cetus,
  },
  {
    id: '0x2975727619f686f83222894f8610af086df2983a8e0f0df19903c2dec74ce9cb',
    tokenType:
      '0xf6c818276fd751df676b650ef691f3f04d4dfed226604460fc5c32d4eaf54aea::kriya_compounder_vt::KRIYA_COMPOUNDER_VT',
    underlyingPool:
      '0xc83d3c409375cb05fbe6a7f30a4f0da4aa75bda3352a08d2285216ef1a470267',
    underlyingDex: Dex.kriya,
  },
  {
    id: '0xc768f9ab7f01b7af94d481ee9286af57b0e05c9a060622c8ee731d404711a2e4',
    tokenType:
      '0x13e03634125a490a285e31aecb1ce7545c08d741c1058a4b5793716e78cf6e27::kriya_lst_vt_1::KRIYA_LST_VT_1',
    underlyingPool:
      '0xf1b6a7534027b83e9093bec35d66224daa75ea221d555c79b499f88c93ea58a9',
    underlyingDex: Dex.kriya,
  },
  {
    tokenType:
      '0x54b03bcb3dd5a009286aa22812826963177793b1dd83203a2731ea34a95bc730::kriya_lst_vt_2::KRIYA_LST_VT_2',
    id: '0x34668043d3b4f80324c2d00478314e40befe8e72353794b5021de930bc8954d8',
    underlyingPool:
      '0xf1b6a7534027b83e9093bec35d66224daa75ea221d555c79b499f88c93ea58a9',
    underlyingDex: Dex.kriya,
  },
  {
    tokenType:
      '0x2b87dd426a94bcc82d7a7177dfac06bebb3c7f4c4feb11c7045f749cf484bbbc::kriya_narrow_vt::KRIYA_NARROW_VT',
    id: '0xc4ce815e5b53caf1fe96d0a8c17a9023b7afa1cc9fe3e0053dcfb35e223b5eb5',
    underlyingPool:
      '0x367e02acb99632e18db69c3e93d89d21eb721e1d1fcebc0f6853667337450acc',
    underlyingDex: Dex.kriya,
  },
  {
    tokenType:
      '0xe28bb1819fb4ab201f7c7616615409c798872fb0b25e16153ccba2a7fdb7f625::kriya_allweather_vt::KRIYA_ALLWEATHER_VT',
    id: '0xbdd32b071f0d6302cb5c19113d4f53e0c98ca1d7d0aef244c3a3da68e0391a52',
    underlyingPool:
      '0x367e02acb99632e18db69c3e93d89d21eb721e1d1fcebc0f6853667337450acc',
    underlyingDex: Dex.kriya,
  },
  {
    tokenType:
      '0xcabe5d1a6d719d8c3c2217079a44441c5c1701394a6d3abd58ac674b054c08f4::kriya_deep_vt::KRIYA_DEEP_VT',
    id: '0xa9c29c881fe0224b5600234891d6da06dd273d5698601c7caa74f15e814d2abc',
    underlyingPool:
      '0xcf370321292e799d93ad4f1bb075636a3506d8bf8ae82f57f7748c966150aac4',
    underlyingDex: Dex.kriya,
  },
];

export const dynamicFieldPositionTypeCetus =
  '0x2::dynamic_field::Field<vector<u8>, 0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::position::Position>';
export const dynamicFieldPositionTypeKriya =
  '0x2::dynamic_field::Field<vector<u8>, 0xf6c05e2d9301e6e91dc6ab6c3ca918f7d55896e1f1edd64adc0e615cde27ebf1::position::Position>';
