import { PublicKey } from '@solana/web3.js';

export const platformId = 'quarry';
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
