export function bitsToNumber(bits: number | string) {
  return asIntN(BigInt(bits));
}

function asIntN(int: bigint, bits = 32) {
  return Number(BigInt.asIntN(bits, BigInt(int)));
}
