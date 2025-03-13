import { PublicKey } from '@solana/web3.js';
import { Platform, solanaNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

export const platformId = 'marginfi';
export const platform: Platform = {
  id: platformId,
  name: 'Marginfi',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/marginfi.webp',
  defiLlamaId: 'parent#marginfi',
  website: 'https://www.marginfi.com/',
  github: 'https://github.com/mrgnlabs/',
  documentation: 'https://docs.marginfi.com/',
  twitter: 'https://twitter.com/marginfi',
  telegram: 'https://t.me/mrgnteam',
  tokens: ['LSTxxxnJzKDFSLr4dUkPcmCf5VyryEqzPLz5j4bpxFp'],
  description:
    'A liquidity layer built for finance. Access native yield, embedded risk systems, and off-chain data plug-ins.',
};
export const MarginfiProgram = new PublicKey(
  'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA'
);

export const MarginfiAccountAddress =
  '4qp6Fx6tnZkY5Wropq9wUYgtFxXKwE6viZxFHg3rdAG8';

export const banksKey = 'banks';
export const solFactor = new BigNumber(10 ** solanaNetwork.native.decimals);
