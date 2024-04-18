import BigNumber from 'bignumber.js';
import { AggregatorAccount } from '../structs';

export function getValueFromAggregator(
  aggregator: AggregatorAccount,
  maxStalenessSec = 0
): number | null {
  if ((aggregator.latestConfirmedRound?.numSuccess ?? 0) === 0) {
    return null;
  }
  if (maxStalenessSec !== 0) {
    const now = new BigNumber(Date.now() / 1000);
    const latestRoundTimestamp =
      aggregator.latestConfirmedRound.roundOpenTimestamp;
    const staleness = now.minus(latestRoundTimestamp);
    if (staleness.gt(maxStalenessSec)) {
      return null;
    }
  }

  return aggregator.latestConfirmedRound.result.mantissa
    .div(10 ** aggregator.latestConfirmedRound.result.scale)
    .toNumber();
}
