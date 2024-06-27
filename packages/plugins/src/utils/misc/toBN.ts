import BN from 'bn.js';
import BigNumber from 'bignumber.js';

export const toBN = (n: number | BN | BigNumber): BN => {
  if (typeof n === 'number') {
    return new BN(n);
  }
  if (n instanceof BN) {
    return n;
  }
  if (n instanceof BigNumber) {
    return new BN(n.toFixed(0)); // Convert BigNumber to a string without decimals
  }
  throw new Error('Unsupported type for conversion to BN');
};
