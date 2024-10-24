import BN from 'bn.js';
import BigNumber from 'bignumber.js';

export const toBN = (n: number | string | BN | BigNumber): BN => {
  if (typeof n === 'number') {
    return new BN(n);
  }
  if (typeof n === 'string') {
    return new BN(new BigNumber(n).toFixed(0));
  }
  if (n instanceof BN) {
    return n;
  }
  if (n instanceof BigNumber) {
    return new BN(n.toFixed(0)); // Convert BigNumber to a string without decimals
  }
  throw new Error(`Unsupported type for conversion to BN (${typeof n}) ${n}`);
};
