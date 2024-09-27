import { Platform } from '@sonarwatch/portfolio-core';
import { CitrusIDL } from '../citrus/idl';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { citrusProgram } from '../citrus/constants';
import { LoopscaleIdl } from './idl';

export const platformId = 'loopscale';
export const platform: Platform = {
  id: platformId,
  name: 'Loopscale',
  image: 'https://sonar.watch/img/platforms/loopscale.webp',
  website: 'https://app.loopscale.com/',
  twitter: 'https://x.com/LoopscaleLabs',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};
export const marketsCachePrefix = `${platformId}-markets`;

export const programId = 'abfcSQac2vK2Pa6UAJb37DzarVxF15bDTdphJzAqYYp';

// borrow tx : https://solana.fm/tx/3Fb3JYbPwJvWsgcE8ihdyuDuBeXiPe8ELJVed5VG9U9cjyEqDZuTWoboacaSawVPRGaCR4b5DSP2Grs8EHYq7tgu?cluster=mainnet-alpha
// deposit lend tx : https://solana.fm/tx/2dRBwkQX3QArnMdEocYhRs3Drni2LR1cWDonsLKX3ks4dvjRXLSDzSx5T4ar5fTU1CjZDJT8kSJq5ADHyn7kRySM?cluster=mainnet-alpha

export const loopscaleIdlItem = {
  programId: programId.toString(),
  idl: LoopscaleIdl,
  idlType: 'anchor',
} as IdlItem;
