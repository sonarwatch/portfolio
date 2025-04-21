import BigNumber from 'bignumber.js';

export function getUnlockedAmountFromLinearVesting(
  startTime: number,
  endTime: number,
  totalAmount: BigNumber,
  periodLength?: number
): number {
  const currentTime = Date.now() / 1000; // Convert to seconds
  if (currentTime < startTime) return 0;
  if (currentTime > endTime) return totalAmount.toNumber();

  // If vestingPeriod is not provided, use the default linear vesting
  if (!periodLength) {
    return totalAmount
      .times((currentTime - startTime) / (endTime - startTime))
      .toNumber();
  }

  // Number of periods that have passed
  const periodsPassed = Math.floor((currentTime - startTime) / periodLength);

  // Amount per period
  const amountPerPeriod = totalAmount.dividedBy(
    Math.floor((endTime - startTime) / periodLength)
  );

  // Total unlocked amount
  const unlockedAmount = amountPerPeriod.times(periodsPassed);

  return unlockedAmount.toNumber();
}
