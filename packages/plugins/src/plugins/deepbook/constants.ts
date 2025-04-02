import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'deepbook';
export const airdropStatics: AirdropStatics = {
  emitterLink: 'https://deepbook.tech',
  claimLink: 'https://claim.deepbook.tech/',
  emitterName: 'DeepBook',
  id: `${platformId}-token-launch`,
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/deepbook.webp',
  claimEnd: undefined,
  claimStart: 1728907200000,
};

export const deepMint =
  '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP';
export const deepDecimals = 6;
