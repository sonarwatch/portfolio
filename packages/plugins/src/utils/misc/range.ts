export function range(start: number, stop?: number, step = 1) {
  const nums: number[] = [];

  let fStart = start;
  let fStop = stop || 0;
  if (stop === undefined) {
    fStart = 0;
    fStop = start;
  }
  for (let i = fStart; i < fStop; i += step) {
    nums.push(i);
  }
  return nums;
}
