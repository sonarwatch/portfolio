import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'parcl';
export const parclPlatform: Platform = {
  id: platformId,
  name: 'Parcl',
  image: 'https://sonar.watch/img/platforms/parcl.png',
  defiLlamaId: 'parent#parcl', // from https://defillama.com/docs/api
  website: 'https://app.parcl.co/',
  twitter: 'https://twitter.com/Parcl',
};

export const programId = new PublicKey(
  '3parcLrT7WnXAcyPfkCz49oofuuf2guUKkjuFkAhZW8Y'
);

export const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const usdcDecimals = 6;
export const airdropApi = 'https://app.parcl.co/api/allocation/';
export const allocationPrefix = `${platformId}/allocation`;
export const prclMint = '4LLbsb5ReP3yEtYzmXewyGjcir5uXtKFURtaEUVC2AHs';
export const prclDecimals = 6;
export const merkleApi = 'https://worker.jup.ag/jup-claim-proof';
export const merkleTree = '';
export const distributorProgram = '';
