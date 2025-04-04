import { ethereumNetwork, TokenPrice } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

/**
 * Calculates the token factor based on decimals from token price
 * @param tokenPrice TokenPrice object containing decimals info
 * @returns BigNumber representing the token factor (10^decimals)
 */
export const getTokenFactor = (tokenPrice?: TokenPrice): BigNumber => {
  const decimals = tokenPrice?.decimals ?? ethereumNetwork.native.decimals;
  return new BigNumber(10).pow(new BigNumber(decimals));
};

export const getAmount = (
  amount: BigNumber,
  tokenPrice?: TokenPrice
): number => {
  const tokenFactor = getTokenFactor(tokenPrice);
  return new BigNumber(amount).dividedBy(tokenFactor).toNumber();
};

/**
 * Convenient one-liner that converts a uint256/bigint received from a contract
 * into a number.
 * For convenience, we also accept a string as input.
 */
export const convertBigIntToNumber = (
  input: bigint | string,
  decimals: number
): number => new BigNumber(input.toString())
    // We're force-casting to leverage our other utility
    .dividedBy(getTokenFactor({ decimals } as TokenPrice))
    .toNumber();
