import BigNumber from 'bignumber.js';
import { Bank } from './struct';

const FRACTIONS = 48;
const MULTIPLIER_NUMBER = 2 ** FRACTIONS;

export function getBorrowRateWithoutUpkeepRate(bank: Bank): BigNumber {
  const totalBorrows = bank.indexedBorrows.multipliedBy(bank.borrowIndex);
  const totalDeposits = bank.indexedDeposits.multipliedBy(bank.depositIndex);

  if (totalDeposits.isZero() && totalBorrows.isZero()) {
    return zeroI80F48();
  }

  const utilization = totalBorrows.div(totalDeposits);
  if (utilization.lte(bank.util0)) {
    const slope = bank.rate0.div(bank.util0);
    return slope.multipliedBy(utilization);
  }
  if (utilization.lt(bank.util1)) {
    const extraUtil = utilization.minus(bank.util0);
    const slope = bank.rate1
      .minus(bank.rate0)
      .div(bank.util1.minus(bank.util0));
    return bank.rate0.plus(slope.multipliedBy(extraUtil));
  }
  const extraUtil = utilization.minus(bank.util1);
  const slope = bank.maxRate
    .minus(bank.rate1)
    .div(new BigNumber(1).minus(bank.util1));
  return bank.rate1.plus(slope.multipliedBy(extraUtil));
}
export function zeroI80F48(): BigNumber {
  const intPart = Math.trunc(0);
  const v = new BigNumber(intPart.toFixed(0)).shiftedBy(48);
  v.plus(new BigNumber((0 - intPart) * MULTIPLIER_NUMBER));
  return new BigNumber(v);
}

/**
 *
 * @returns total borrow rate, 0 is 0% where 1 is 100% (including loan upkeep rate)
 */
export function getBorrowRate(bank: Bank): number {
  return getBorrowRateWithoutUpkeepRate(bank).plus(bank.loanFeeRate).toNumber();
}

export function getDepositRate(bank: Bank): number {
  const borrowRate = getBorrowRate(bank);
  const totalBorrows = bank.indexedBorrows.multipliedBy(bank.borrowIndex);
  const totalDeposits = bank.indexedDeposits.multipliedBy(bank.depositIndex);

  if (totalDeposits.isZero() && totalBorrows.isZero()) {
    return zeroI80F48().toNumber();
  }
  if (totalDeposits.isZero()) {
    return bank.maxRate.toNumber();
  }

  const utilization = totalBorrows.div(totalDeposits);
  return utilization.multipliedBy(borrowRate).toNumber();
}
