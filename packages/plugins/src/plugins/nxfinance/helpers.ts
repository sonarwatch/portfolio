import BigNumber from 'bignumber.js';
import { MarginPool } from './types';

const getBorrowApr = (utilization: BigNumber) => {
  if (utilization.isLessThanOrEqualTo(0.8)) {
    return parseFloat(
      utilization.times(0.125).plus(0.1).toFixed(4, BigNumber.ROUND_DOWN)
    );
  }
  return parseFloat(
    utilization.times(1.25).minus(0.8).toFixed(4, BigNumber.ROUND_DOWN)
  );
};

const getM = (marginPool: MarginPool) => {
  const borrowTokens = new BigNumber(marginPool.borrowedTokens);
  const depositTokens = new BigNumber(marginPool.depositTokens);
  const utilization = borrowTokens.dividedBy(depositTokens);
  const borrowAPR = getBorrowApr(utilization);

  return new BigNumber(borrowAPR)
    .multipliedBy(Date.now() / 1000 - Number(marginPool.accruedUntil))
    .dividedBy(31536e3)
    .multipliedBy(borrowTokens.dividedBy(10 ** 6));
};

const getLoanInterest = (marginPool: MarginPool) => {
  const m = getM(marginPool);

  return new BigNumber(marginPool.loanInterest)
    .dividedToIntegerBy(10 ** 6)
    .plus(m)
    .toNumber();
};

const getDepositInterest = (marginPool: MarginPool) => {
  const m = getM(marginPool);

  return new BigNumber(marginPool.depositInterest)
    .dividedToIntegerBy(10 ** 6)
    .plus(m)
    .toNumber();
};

export const getSupplyNoteRate = (marginPool: MarginPool) => {
  const depositInterest = getDepositInterest(marginPool);
  const depositTokens = new BigNumber(marginPool.depositTokens).dividedBy(
    10 ** 6
  );
  const depositNotes = new BigNumber(marginPool.depositNotes).dividedBy(
    10 ** 6
  );

  return depositTokens.plus(depositInterest).dividedBy(depositNotes);
};

export const getBorrowNoteRate = (marginPool: MarginPool) => {
  const loanInterest = getLoanInterest(marginPool);
  const borrowedTokens = new BigNumber(marginPool.borrowedTokens).dividedBy(
    10 ** 6
  );
  const loanNotes = new BigNumber(marginPool.loanNotes).dividedBy(10 ** 6);

  return borrowedTokens.plus(loanInterest).dividedBy(loanNotes);
};
