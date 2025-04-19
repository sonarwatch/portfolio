export function getUnlockedAmountFromLinearVesting(
  startTime: number,
  endTime: number,
  totalAmount: number,
  vestingPeriod?: number
): number {
  const currentTime = Date.now();
  if (currentTime < startTime) return 0;
  if (currentTime > endTime) return totalAmount;

  // If vestingPeriod is not provided, use the default linear vesting
  if (!vestingPeriod) {
    return ((currentTime - startTime) / (endTime - startTime)) * totalAmount;
  }

  // For linear vesting with a specific period
  const unlockedAmount =
    ((currentTime - startTime) / vestingPeriod) * totalAmount;

  return Math.min(unlockedAmount, totalAmount);
}
