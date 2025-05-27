import { PublicKey } from '@solana/web3.js';
import { VSRInfos } from './types';

export const platformId = 'realms';

export const heliumPlatformId = 'helium';
export const splGovProgramsKey = 'splGovernancePrograms';
export const registrarKey = 'registrars';

export const realmsCustomVsrInfo: VSRInfos[] = [
  {
    programId: new PublicKey('VoteMBhDCqGLRgYpp9o7DGyq81KNmwjXQRAHStjtJsS'), // Marinade
    mint: 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
  },
  {
    programId: new PublicKey('4Q6WW2ouZ6V3iaNm56MTd5n2tnTm4C5fiH8miFHnAFHo'), // Mango
    mint: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
  },
  {
    programId: new PublicKey('VotEn9AWwTFtJPJSMV5F9jsMY6QwWM5qn3XP9PATGW7'), // PsyFi
    mint: 'PsyFiqqjiv41G7o5SMRzDJCu4psptThNR2GtfeGHfSq',
  },
  {
    programId: new PublicKey('5sWzuuYkeWLBdAv3ULrBfqA51zF7Y4rnVzereboNDCPn'), // Xandeum L1
    mint: '2j437Lt84XvysJiYbXTSJfAMy26Et9HiVGFvGFp8nYWH',
  },
];

export const realmsVsrProgram = new PublicKey(
  'vsr2nfGVNHmSY8uxoBGqq8AQbwz3JwaEaHqGbsTPXqQ'
);

export const splGovernanceUrl =
  'https://app.realms.today/api/splGovernancePrograms';
