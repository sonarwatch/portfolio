import BigNumber from 'bignumber.js';
import { Pool } from './types';

export const extractCointypesFromPool = (poolType: string): string[] => {
  const regex = /<([^<>]+)>/; // Updated regex to capture all content between <>
  const match = regex.exec(poolType);

  if (match === null) {
    return [];
  }

  const content = match[1];
  return content.split(',').map((type) => type.trim());
};

export const getExchangeRate = (pool: Pool): BigNumber =>
  new BigNumber(pool.tokensInvested).dividedBy(pool.xTokenSupply);
