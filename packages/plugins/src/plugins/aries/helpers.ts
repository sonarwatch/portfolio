import BigNumber from 'bignumber.js';
import { Reserve } from './types';

export function getName(accountName: string) {
  return accountName.replace('profile', '');
}

export function getBorrowApr(
  utilization: BigNumber,
  borrowedAmount: BigNumber,
  availableAmount: BigNumber,
  reserveData: Reserve
): number {
  const interestRateConfig = reserveData.value.interest_rate_config;
  const optimalUtilization = interestRateConfig.optimal_utilization / 100;
  const optimalRate = interestRateConfig.optimal_borrow_rate / 100;
  const minRate = interestRateConfig.min_borrow_rate / 100;
  const maxRate = interestRateConfig.max_borrow_rate / 100;

  if (borrowedAmount.isZero()) return minRate;
  if (availableAmount.isZero()) return maxRate;

  if (utilization.isLessThan(optimalUtilization)) {
    const utilizationDelta = utilization;
    const utilStepsDelta = optimalUtilization;
    return utilizationDelta
      .dividedBy(utilStepsDelta)
      .times(optimalRate)
      .toNumber();
  }
  const utilizationDelta = utilization.minus(optimalUtilization);
  const utilStepsDelta = BigNumber(1).minus(optimalUtilization);
  return utilizationDelta
    .dividedBy(utilStepsDelta)
    .times(maxRate)
    .plus(optimalRate)
    .toNumber();
}

export function getDepositApr(
  utilization: BigNumber,
  borrowApr: number,
  reserveData: Reserve
): number {
  return BigNumber(borrowApr)
    .times(1 - Number(reserveData.value.reserve_config.reserve_ratio) / 10 ** 2)
    .times(utilization)
    .toNumber();
}
