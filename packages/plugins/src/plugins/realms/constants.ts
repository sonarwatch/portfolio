import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'realms';

export const realmsPlatform: Platform = {
  id: platformId,
  name: 'Realms',
  image: 'https://sonar.watch/img/platforms/realms.png',
  defiLlamaId: 'realms',
};

export const voteProgramId = new PublicKey(
  'A7kmu2kUcnQwAVn8B4znQmGJeUrsJ1WEhYVMtmiBLkEr'
);

export const voterProgramId = new PublicKey(
  'VoteMBhDCqGLRgYpp9o7DGyq81KNmwjXQRAHStjtJsS'
);

export const goveProgramId = new PublicKey(
  'GovMaiHfpVPw8BAM1mbdzgmSZYDw2tdP32J2fapoQoYs'
);
