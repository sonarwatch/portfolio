import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'cetus';
export const platform: Platform = {
  id: platformId,
  name: 'Cetus',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/cetus.webp',
  defiLlamaId: 'parent#cetus',
  website: 'https://www.cetus.zone/',
};

export const cetusMint =
  '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS';
export const xCetusMint =
  '0x9e69acc50ca03bc943c4f7c5304c2a6002d507b51c11913b247159c60422c606::xcetus::XCETUS';

export const clmmPoolsPrefix = `${platformId}-clmmPools`;

export const clmmPoolPackageId =
  '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb';

export const clmmType = `${clmmPoolPackageId}::position::Position`;

export const createPoolEvent = `${clmmPoolPackageId}::factory::CreatePoolEvent`;
export const poolParentId =
  '0x4c9ab808d50ca1358cc699bb53b6334b9471d4718fb19bb621ff41c2e93bbce4';
export const firstPool =
  '0x58ec75646f31c384f485bd92a5f1d19aa60713eabe2447cbc1354c8c229b10b7';

// add cetus poolIds here to be sure they're included in the job
// pools with most volume from https://app.cetus.zone/pool/list
export const hardCodedPools = [
  '0xb8d7d9e66a60c239e7a60110efcf8de6c705580ed924d0dde141f4a0e2c90105',
  '0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630',
  '0x1efc96c99c9d91ac0f54f0ca78d2d9a6ba11377d29354c0a192c86f0495ddec7',
  '0xb785e6eed355c1f8367c06d2b0cb9303ab167f8359a129bb003891ee54c6fce0',
  '0x4c50ba9d1e60d229800293a4222851c9c3f797aa5ba8a8d32cc67ec7e79fec60',
  '0x59cf0d333464ad29443d92bfd2ddfd1f794c5830141a5ee4a815d1ef3395bf6c',
  '0x2e041f3fd93646dcc877f783c1f2b7fa62d30271bdef1f21ef002cebf857bded',
  '0xe01243f37f712ef87e556afb9b1d03d0fae13f96d324ec912daffc339dfdcbd2',
  '0x6bd72983b0b5a77774af8c77567bb593b418ae3cd750a5926814fcd236409aaa',
  '0xc8d7a1503dc2f9f5b05449a87d8733593e2f0f3e7bffd90541252782e4d2ca20',
  '0x871d8a227114f375170f149f7e9d45be822dd003eba225e83c05ac80828596bc',
  '0x0254747f5ca059a1972cd7f6016485d51392a3fde608107b93bbaebea550f703',
];

// VaultsManager : 0x25b82dd2f5ee486ed1c8af144b89a8931cd9c29dee3a86a1bfe194fdea9d04a6
// Vaults https://api-sui.cetus.zone/v2/sui/auto_pools
export const vaultManagerMap =
  '0x9036bcc5aa7fd2cceec1659a6a1082871f45bc400c743f50063363457d1738bd';

export const farmNftType =
  '0x11ea791d82b5742cc8cab0bf7946035c97d9001d7c3803a93f119753da66f526::pool::WrappedPositionNFT';

export const limitPackageId =
  '0x533fab9a116080e2cb1c87f1832c1bf4231ab4c32318ced041e75cc28604bba9';
export const limitUserIndexId =
  '0x7f851ac19e438f97e78a5335eed4f12766a3a0ae94340bab7956a402f0e6212e';
export const devInspectTxSender =
  '0x326ce9894f08dcaa337fa232641cc34db957aec9ff6614c1186bc9a7508df0bb';
export const dcaUserIndexerId =
  '0x0ae365f60f2fa692831f9496c9e49b2440c74f14e8eab6f88dbb418c443b5020';
