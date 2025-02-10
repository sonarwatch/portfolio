import BN from 'bn.js';

const BPS_POWER = new BN(10_000);
const divCeil = (a: BN, b: BN) => {
  const dm = a.divmod(b);
  // Fast case - exact division
  if (dm.mod.isZero()) return dm.div;
  // Round up
  return dm.div.ltn(0) ? dm.div.isubn(1) : dm.div.iaddn(1);
};
const getImpactFeeBps = (amount: BN, tradeImpactFeeScalar: BN) =>
  tradeImpactFeeScalar.eqn(0)
    ? new BN(0)
    : divCeil(amount.mul(BPS_POWER), tradeImpactFeeScalar);

export const getFeeAmount = (
  baseFeeBps: BN,
  amount: BN,
  tradeImpactFeeScalar: BN
) => {
  if (amount.eqn(0)) {
    return new BN(0);
  }
  const impactFeeCoefficientBps = getImpactFeeBps(amount, tradeImpactFeeScalar);
  const totalFeeBps = impactFeeCoefficientBps.add(baseFeeBps);

  return amount.mul(totalFeeBps).div(BPS_POWER);
};
