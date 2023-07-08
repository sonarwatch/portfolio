/* eslint-disable no-bitwise */
export function fp64ToFloat(a: bigint): number {
  // avoid large number
  let mask = BigInt('0xffffffff000000000000000000000000');
  if ((a & mask) !== BigInt(0)) {
    throw new Error('too large');
  }

  // integer part
  mask = BigInt('0x10000000000000000');
  let base = 1;
  let result = 0;
  for (let i = 0; i < 32; ++i) {
    if ((a & mask) !== BigInt(0)) {
      result += base;
    }
    base *= 2;
    mask <<= BigInt(1);
  }

  // fractional part
  mask = BigInt('0x8000000000000000');
  base = 0.5;
  for (let i = 0; i < 32; ++i) {
    if ((a & mask) !== BigInt(0)) {
      result += base;
    }
    base /= 2;
    mask >>= BigInt(1);
  }
  return result;
}

export function tokenToLpType(tokenType: string): string {
  return tokenType.replace('PoolToken', 'Pool');
}
