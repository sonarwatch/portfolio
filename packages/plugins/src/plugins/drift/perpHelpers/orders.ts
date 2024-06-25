import BN from 'bn.js';

export function standardizeBaseAssetAmount(
  baseAssetAmount: BN,
  stepSize: BN
): BN {
  const remainder = baseAssetAmount.mod(stepSize);
  return baseAssetAmount.sub(remainder);
}
