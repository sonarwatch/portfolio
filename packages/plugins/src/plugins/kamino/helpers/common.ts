import BigNumber from 'bignumber.js';
import { ParsedAccount } from '../../../utils/solana';
import { Reserve } from '../structs/klend';
import { getTotalSupply } from './apr';

const INITIAL_COLLATERAL_RATE = 1;

export function getEchangeRate(reserve: ParsedAccount<Reserve>): number {
  const totalSupply = new BigNumber(
    getTotalSupply(reserve.liquidity).toString()
  );
  const { mintTotalSupply } = reserve.collateral;
  if (mintTotalSupply.isZero() || totalSupply.isZero()) {
    return INITIAL_COLLATERAL_RATE;
  }
  return new BigNumber(mintTotalSupply.toString())
    .dividedBy(totalSupply)
    .toNumber();
}
