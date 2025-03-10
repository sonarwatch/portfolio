import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { mineIdl } from './mineIdl';
import { mergeMineIdl } from './mergeMineIdl';
import { quarryRedeemerIdl } from './quarryRedeemerIdl';
import { redeemerIdl } from './redeemerIdl';

export const platformId = 'quarry';
export const platform: Platform = {
  id: platformId,
  name: 'Quarry',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/quarry.webp',
  website: 'https://app.quarry.so/',
  // twitter: 'https://x.com/QuarryProtocol',
  defiLlamaId: 'quarry', // from https://defillama.com/docs/api
  github: 'https://github.com/QuarryProtocol',
  isDeprecated: true,
};

export const IOUTokensElementName = 'IOU Tokens';

export const rewardersCacheKey = `rewarders`;
export const rewardersUrl = `https://cdn.jsdelivr.net/gh/QuarryProtocol/rewarder-list-build@master/mainnet-beta/all-rewarders-with-info.json`;
export const mergeMineProgramId = new PublicKey(
  'QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto'
);
export const mineProgramId = new PublicKey(
  'QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB'
);

export const quarryRedeemerProgramId = new PublicKey(
  'QRDxhMw1P2NEfiw5mYXG79bwfgHTdasY2xNP76XSea9'
);
export const redeemerProgramId = new PublicKey(
  'RDM23yr8pr1kEAmhnFpaabPny6C9UVcEcok3Py5v86X'
);

export const mineIdlItem = {
  programId: mineProgramId.toString(),
  idl: mineIdl,
  idlType: 'anchor',
} as IdlItem;

export const mergeMineIdlItem = {
  programId: mergeMineProgramId.toString(),
  idl: mergeMineIdl,
  idlType: 'anchor',
} as IdlItem;

export const quarryRedeemerIdlItem = {
  programId: quarryRedeemerProgramId.toString(),
  idl: quarryRedeemerIdl,
  idlType: 'anchor',
} as IdlItem;

export const redeemerIdlItem = {
  programId: redeemerProgramId.toString(),
  idl: redeemerIdl,
  idlType: 'anchor',
} as IdlItem;
