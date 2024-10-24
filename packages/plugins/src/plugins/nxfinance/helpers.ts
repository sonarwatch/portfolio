import BigNumber from 'bignumber.js';
import { LendingPool, MarginPool } from './types';

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

export const formatLendingPool = (t: LendingPool, decimals: number) => {
  const o = new BigNumber(t.depositNotes);
  const n = new BigNumber(t.depositTokens);
  const i = new BigNumber(t.borrowNotes);
  const r = new BigNumber(t.borrowTokens);
  const a = r.dividedBy(n || 1).toFixed(4, BigNumber.ROUND_DOWN);
  // eslint-disable-next-line @typescript-eslint/no-shadow,func-names
  const s = (function (e, t) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const o = e.interestRateConfigs
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .map((e) => ({
        kValue: e.kValue / 1e5,
        bValue: e.bValue / 1e5,
        utilizationRate: e.utilizationRate / 100,
      }))
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .find((e) => t <= e.utilizationRate);
    return o
      ? new BigNumber(o.kValue)
          .times(t)
          .plus(o.bValue)
          .toFixed(4, BigNumber.ROUND_DOWN)
      : '0';
  })(t, parseFloat(a));
  const c = new BigNumber(s).times(a).toFixed(4, BigNumber.ROUND_DOWN);
  const u = new BigNumber(t.depositInterest);
  const l = new BigNumber(t.borrowInterest);
  const m = new BigNumber(t.accruedUntil).toNumber();
  const g = new BigNumber(new Date().getTime() / 1e3).minus(m).toNumber();
  const p = new BigNumber(t.protocolFee).toNumber() / 1e5;
  const M = decimals; // decimals de SOL
  const h = new BigNumber(r)
    .times(s)
    .times(g)
    .div(31536e3)
    .toFixed(M, BigNumber.ROUND_DOWN);
  const y = new BigNumber(h).plus(l).toFixed(M, BigNumber.ROUND_UP);
  const k = new BigNumber(1)
    .minus(p)
    .times(h)
    .plus(u)
    .toFixed(M, BigNumber.ROUND_DOWN);
  const P = new BigNumber(r)
    .plus(y)
    .div(i || 1)
    .toFixed(9, BigNumber.ROUND_UP);
  const w = new BigNumber(n)
    .plus(k)
    .div(o || 1)
    .toFixed(9, BigNumber.ROUND_DOWN);

  return {
    APR: parseFloat(c),
    borrowAPR: parseFloat(s),
    depositNoteNum: o,
    depositedTokenNum: n,
    depositNoteRate: parseFloat(w),
    borrowNoteNum: i,
    borrowedTokenNum: r,
    borrowNoteRate: parseFloat(P),
    depositInterest: parseFloat(k),
    borrowInterest: parseFloat(y),
  };
};
