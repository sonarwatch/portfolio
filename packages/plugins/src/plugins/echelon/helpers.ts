/* eslint-disable eqeqeq */
/* eslint-disable operator-assignment */
/* eslint-disable no-bitwise */
// input cannot be larger the 2^31
// this should allow at least 6 digits precision in the fractional part
// https://stackoverflow.com/questions/45929493/node-js-maximum-safe-floating-point-number

const ZERO = BigInt(0);
const ONE = BigInt(1);

export const fp64ToFloat = (a: bigint): number => {
  // avoid large number
  let mask = BigInt('0xffffffff000000000000000000000000');
  if ((a & mask) != ZERO) {
    throw new Error('too large');
  }

  // integer part
  mask = BigInt('0x10000000000000000');
  let base = 1;
  let result = 0;
  for (let i = 0; i < 32; ++i) {
    if ((a & mask) != ZERO) {
      result += base;
    }
    base *= 2;
    mask = mask << ONE;
  }

  // fractional part
  mask = BigInt('0x8000000000000000');
  base = 0.5;
  for (let i = 0; i < 32; ++i) {
    if ((a & mask) != ZERO) {
      result += base;
    }
    base /= 2;
    mask = mask >> ONE;
  }
  return result;
};
