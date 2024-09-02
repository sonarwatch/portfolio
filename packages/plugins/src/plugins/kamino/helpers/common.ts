import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import { ParsedAccount } from '../../../utils/solana';
import { BigFractionBytes, Reserve } from '../structs/klend';
import { getTotalSupply } from './apr';
import { allocationApiUrl } from '../constants';

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

type Allocation = {
  quantity: string;
  name: string;
};

export async function getAllocationsBySeason(
  owner: string,
  season: 1 | 2
): Promise<Allocation[] | undefined> {
  const res: AxiosResponse<Allocation[]> | null = await axios
    .get(`${allocationApiUrl}${owner}/allocations?source=Season${season}`, {
      timeout: 1000,
    })
    .catch(() => null);
  return res ? res.data : undefined;
}

export function getCumulativeBorrowRate(borrowRatesSf: BigFractionBytes) {
  return [
    BigNumber(borrowRatesSf.value0),
    BigNumber(borrowRatesSf.value1),
    BigNumber(borrowRatesSf.value2),
    BigNumber(borrowRatesSf.value3),
  ].reduce(
    (prev, curr, i) => prev.plus(curr.shiftedBy(-i * 64)),
    new BigNumber(0)
  );
}

const FRACTIONS = 60;
const MULTIPLIER_NUMBER = 2 ** FRACTIONS;

export function sfToValue(sf: BigNumber) {
  return sf.dividedBy(MULTIPLIER_NUMBER);
}
