import { PublicKey } from '@solana/web3.js';
import { solanaNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

export const platformId = 'marinade';
export const cachePrefix = 'marinade';
export const marinadeTicketProgramId = new PublicKey(
  'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD'
);
export const solFactor = new BigNumber(10 ** solanaNetwork.native.decimals);
