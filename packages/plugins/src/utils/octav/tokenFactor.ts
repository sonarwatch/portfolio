import BigNumber from 'bignumber.js';
import { TokenPrice } from '@sonarwatch/portfolio-core';

/**
 * Calculates the token factor based on decimals from token price
 * @param tokenPrice TokenPrice object containing decimals info
 * @returns BigNumber representing the token factor (10^decimals)
 */
export const getTokenFactor = (tokenPrice?: TokenPrice): BigNumber => {
  const decimals = tokenPrice?.decimals ?? 18;
  return new BigNumber(10).pow(new BigNumber(decimals));
};

export const getAmount = (
  amount: BigNumber,
  tokenPrice?: TokenPrice
): number => {
  const tokenFactor = getTokenFactor(tokenPrice);
  return new BigNumber(amount).dividedBy(tokenFactor).toNumber();
};
