import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'parcl';
export const platformImage = 'https://sonar.watch/img/platforms/parcl.webp';
export const platformWebsite = 'https://app.parcl.co/';
export const platformName = 'Parcl';
export const prclMint = '4LLbsb5ReP3yEtYzmXewyGjcir5uXtKFURtaEUVC2AHs';
export const platform: Platform = {
  id: platformId,
  name: platformName,
  image: platformImage,
  defiLlamaId: 'parent#parcl', // from https://defillama.com/docs/api
  website: platformWebsite,
  twitter: 'https://twitter.com/Parcl',
  description: 'Making investing in real estate faster, simpler, and smarter. ',
  discord: 'https://discord.gg/parcl',
  documentation: 'https://docs.parcl.co/',
  github: 'https://github.com/ParclFinance',
  tokens: [prclMint],
};

export const programId = new PublicKey(
  '3parcLrT7WnXAcyPfkCz49oofuuf2guUKkjuFkAhZW8Y'
);

export const stakingProgramId = new PublicKey(
  '2gWf5xLAzZaKX9tQj9vuXsaxTWtzTZDFRn21J3zjNVgu'
);

export const airdropApi = 'https://gnome-api-mainnet.fly.dev/user/';
export const allocationPrefix = `${platformId}-allocation`;
export const prclDecimals = 6;
export const merkleApi = 'https://worker.jup.ag/jup-claim-proof';
export const merkleTree = '5nRBuSmpA98JgrznGYEAFTvQAA7hCdFkVKS9e41N8mBQ';
export const distributorProgram =
  '5tu3xkmLfud5BAwSuQke4WSjoHcQ52SbrPwX9es8j6Ve';

export const airdropStatics: AirdropStatics = {
  id: 'parcl-airdrop-1',
  claimLink: 'https://claims.parcllimited.com/',
  image: platformImage,
  emitterLink: platformWebsite,
  emitterName: platformName,
  claimStart: 1704067200000,
  claimEnd: 1735603200000,
  name: undefined,
};
