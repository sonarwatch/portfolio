export default async function runInBatch<T>(
  functionsToRun: (() => Promise<T>)[],
  batchSize = 100
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = [];

  while (functionsToRun.length !== 0) {
    const currFunctionsToRun = functionsToRun.splice(0, batchSize);
    const promises = currFunctionsToRun.map((fToRun) => fToRun());
    const currResults = await Promise.allSettled(promises);
    results.push(...currResults);
  }

  return results;
}
