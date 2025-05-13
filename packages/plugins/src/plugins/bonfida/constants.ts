import { PublicKey } from '@solana/web3.js';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'sns';
export const fidaMint = 'EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp';
export const offerPid = new PublicKey(
  '85iDfUvr3HJyLM2zcq5BXSiDvUWfw6cSE1FfNBo8Ap29'
);

export const airdropPid = new PublicKey(
  'bMersFdXPWiRzjqmbviCRMvwvN1FpRmATaqrF894CbU'
);

export const airdropApi =
  'https://jito-distributor-api.n38t0uklh84us.ap-southeast-1.cs.amazonlightsail.com/proof/';
export const fidaDecimals = 6;

export const snsMint = 'SNS8DJbHc34nKySHVhLGMUUE72ho6igvJaxtq9T3cX3';

export const snsAirdropStatics: AirdropStatics = {
  emitterLink: 'https://sns.id/',
  emitterName: 'sns',
  id: 'sns-airdrop-sns',
  claimLink: 'https://airdrop.sns.id/',
  claimStart: 1747137600000,
  claimEnd: 1754913600000,
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/debridge.webp',
};
