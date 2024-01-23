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
  {
    programId: new PublicKey('4Q6WW2ouZ6V3iaNm56MTd5n2tnTm4C5fiH8miFHnAFHo'),
    mint: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
  },
  // {
  //   programId: new PublicKey('vsr2nfGVNHmSY8uxoBGqq8AQbwz3JwaEaHqGbsTPXqQ'),
  //   mint: 'DUALa4FC2yREwZ59PHeu1un4wis36vHRv5hWVBmzykCJ',
  // },
];
export const splGovernanceUrl =
  'https://app.realms.today/api/splGovernancePrograms';
