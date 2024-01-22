import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { VSRInfos } from './types';

export const platformId = 'realms';

export const realmsPlatform: Platform = {
  id: platformId,
  name: 'Realms',
  image: 'https://sonar.watch/img/platforms/realms.png',
  defiLlamaId: 'spl-governance',
  website: 'https://app.realms.today/',
};

export const splGovProgramsKey = 'splGovernancePrograms';

export const vsrInfos: VSRInfos[] = [
  {
    programId: new PublicKey('VoteMBhDCqGLRgYpp9o7DGyq81KNmwjXQRAHStjtJsS'),
    mint: 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
  },
];
export const splGovernanceUrl =
  'https://app.realms.today/api/splGovernancePrograms';
