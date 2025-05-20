import BN from 'bn.js';
import BigNumber from 'bignumber.js';

export class Number192 {
  static readonly PRECISION = 15;
  static readonly ZERO = new Number192(new BN(0));
  static readonly ONE = new Number192(new BN(1_000_000_000_000_000));
  static readonly MAX = new Number192(new BN(new Array<number>(24).fill(255)));
  private static readonly U64_MAX = new BN('18446744073709551615');
  private static readonly BPS_EXPONENT = -4;

  private constructor(private bn: BN) {}

  toBigNumber() {
    return new BigNumber(this.toBn(0).toNumber());
  }

  /** Removes the fractional component from the number. */
  toBn(exponent: number): BN {
    const extraPrecision = Number192.PRECISION + exponent;
    const precValue = Number192.tenPow(new BN(Math.abs(extraPrecision)));

    if (extraPrecision < 0) {
      return this.bn.mul(precValue);
    }
    return this.bn.div(precValue);
  }

  static fromBits(bits: number[]): Number192 {
    return new Number192(new BN(bits, 'le'));
  }

  static max(a: Number192, b: Number192): Number192 {
    return new Number192(BN.max(a.bn, b.bn));
  }

  static tenPow(exponent: BN) {
    return new BN(10).pow(exponent);
  }
}
