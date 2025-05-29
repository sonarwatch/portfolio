import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'sanctum';
export const platformImage = 'https://sonar.watch/img/platforms/sanctum.webp';
export const platformWebsite = 'https://www.sanctum.so/';
export const cloudMint = 'CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu';
export const sCloudMint = 'sc1dNAxRBj5CNWaGC26AR7PEW75R36Umzt1V8vuP8kZ';
export const lstsKey = 'lsts';

// If this API doesn't work anymore, you can find the tree.json inside our shared convo
// with sanctum team
export const asrApi = 'https://asr1-api.sanctum.so/amount/';
export const cloudDecimals = 9;

export const s1AirdropStatics: AirdropStatics = {
  id: 'sanctum',
  claimStart: 1721314800000,
  claimEnd: 1744588800000,
  emitterName: 'Sanctum',
  emitterLink: platformWebsite,
  claimLink: 'https://lfg.jup.ag/sanctum',
  image: platformImage,
};

export const nclbAirdropStatics: AirdropStatics = {
  id: 'sanctum-nclb', // No Cloud Left Behing
  claimStart: undefined,
  claimEnd: undefined,
  emitterName: 'Sanctum',
  emitterLink: platformWebsite,
  claimLink: 'https://appeal.sanctum.so/results',
  image: platformImage,
};

export const stakingPid = new PublicKey(
  'bon4Kh3x1uQK16w9b9DKgz3Aw4AP1pZxBJk55Q6Sosb'
);

export const distributorPid = new PublicKey(
  '9R2CZDyVjBBK2bxx6NfKdnYMYfh8TQEphUUgZ4861XqJ'
);
export const asrAirdropStatics: AirdropStatics = {
  id: 'sanctum-asr',
  claimStart: 1755871200000,
  claimEnd: 1755648000000,
  emitterName: 'Sanctum',
  emitterLink: platformWebsite,
  claimLink: 'https://vote.sanctum.so/',
  image: platformImage,
  name: 'ASR #1',
};
