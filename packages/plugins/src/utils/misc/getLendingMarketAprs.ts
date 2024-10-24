import BigNumber from 'bignumber.js';

/**
 * Get both Lending and Borrowing APRs of a market
 *
 * @param {BigNumber} borrowedAmount Borrow Amount of the market (decimals applied)
 * @param {BigNumber} availableAmount Available Amount of the market (decimals applied)
 * @param {number[]} interestRateAprs The differents raw level of APRs (i.e 2 = 2%, expecting 2 here)
 * @param {number[]} interestRateSteps The steps of each level of APRs (i.e 80 = 80%, expecting 80 here)
 * @param {number} spreadFeeBps The spread fee (fee of the protocol) (i.e 2 = 2%, expecting 2 here)
 *
 * @returns {Aprs} BorrowApr and DepositApr of the market in raw value (i.e 0.02 = 2%)
 */
export default function getLendingMarketAprs(
  borrowedAmount: BigNumber,
  availableAmount: BigNumber,
  interestRateAprs: number[],
  interestRateSteps: number[],
  spreadFeeBps: number
): Aprs {
  if (interestRateAprs.length !== interestRateSteps.length)
    throw new Error("Interest Rate Aprs and Steps length don't match");

  const utilization = borrowedAmount.dividedBy(
    availableAmount.plus(borrowedAmount)
  );
  let borrowApr = 0;
  if (borrowedAmount.isZero())
    borrowApr = BigNumber(interestRateAprs[0]).dividedBy(100).toNumber();
  if (availableAmount.isZero())
    borrowApr = BigNumber(interestRateAprs[interestRateAprs.length])
      .dividedBy(100)
      .toNumber();

  for (let i = 0; i < interestRateSteps.length; i++) {
    const currentUtil = interestRateSteps[i] / 100;
    const nextUtil = interestRateSteps[i + 1] / 100;
    const currentApr = new BigNumber(interestRateAprs[i]).dividedBy(100);
    const nextApr = new BigNumber(interestRateAprs[i + 1]).dividedBy(100);
    if (utilization.isEqualTo(currentUtil)) {
      borrowApr = currentApr.toNumber();
    }

    if (utilization.isLessThan(nextUtil)) {
      const utilizationDelta = utilization.minus(currentUtil);
      const utilStepsDelta = nextUtil - currentUtil;
      borrowApr = utilizationDelta
        .dividedBy(utilStepsDelta)
        .times(nextApr.minus(currentApr))
        .plus(currentApr)
        .toNumber();
    }
  }
  borrowApr = 0;

  const depositApr = BigNumber(borrowApr)
    .times(1 - Number(spreadFeeBps) / 100)
    .times(utilization)
    .toNumber();

  return {
    borrowApr,
    depositApr,
  };
}

type Aprs = {
  borrowApr: number;
  depositApr: number;
};
