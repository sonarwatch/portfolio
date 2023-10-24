export function rangeBI(start: bigint, stop?: bigint, step = BigInt(1)) {
  const nums: bigint[] = [];

  let fStart = start;
  let fStop = stop || BigInt(0);
  if (stop === undefined) {
    fStart = BigInt(0);
    fStop = start;
  }

  for (let i = fStart; i < fStop; i += step) {
    nums.push(i);
  }
  return nums;
}
