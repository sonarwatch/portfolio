import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'bonfida';
export const platform: Platform = {
  id: platformId,
  name: 'Bonfida (SNS)',
  image: 'https://sonar.watch/img/platforms/bonfida.webp',
  website: 'https://www.sns.id/',
  twitter: 'https://twitter.com/bonfida',
  defiLlamaId: 'solana-name-service', // from https://defillama.com/docs/api
};

export const offerPid = new PublicKey(
  '85iDfUvr3HJyLM2zcq5BXSiDvUWfw6cSE1FfNBo8Ap29'
);

export const airdropPid = new PublicKey(
  'bMersFdXPWiRzjqmbviCRMvwvN1FpRmATaqrF894CbU'
);

export const airdropApi =
  'https://jito-distributor-api.n38t0uklh84us.ap-southeast-1.cs.amazonlightsail.com/proof/';
export const fidaMint = 'EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp';
export const fidaDecimals = 6;
