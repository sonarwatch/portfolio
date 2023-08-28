/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function runInBatchWithArgss<T>(
  toRun: (...args: any[]) => Promise<T>,
  argss: Array<Array<any>>,
  batchSize = 100
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = [];
  const argssCopy = [...argss];

  while (argssCopy.length !== 0) {
    const currArgss = argssCopy.splice(0, batchSize);
    const promises = currArgss.map((args) => toRun(...args));
    const currResults = await Promise.allSettled(promises);
    results.push(...currResults);
  }

  return results;
}
