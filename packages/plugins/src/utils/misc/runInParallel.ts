/**
 * Runs an array of asynchronous functions in parallel with a specified concurrency limit.
 * @template T The type of the resolved value of the promises returned by the functions.
 *
 * @param {(() => Promise<T>)[]} functionsToRun - An array of functions that return promises.
 * Each function is expected to return a promise when called.
 *
 * @param {number} [limit=100] - The maximum number of promises that can be executed concurrently.
 * If the limit is set to 0 or less, all functions will run concurrently without any limit.
 */
export default async function runInParallel<T>(
  functionsToRun: (() => Promise<T>)[],
  limit = 100
): Promise<PromiseSettledResult<T>[]> {
  const results: Promise<PromiseSettledResult<T>>[] = [];
  const executing: Promise<void>[] = [];

  for (const func of functionsToRun) {
    const p = func().then(
      (value) => ({ status: 'fulfilled', value } as const),
      (reason) => ({ status: 'rejected', reason } as const)
    );

    results.push(p);

    const e = p.then(() => {
      executing.splice(executing.indexOf(e), 1);
    });
    executing.push(e);

    if (executing.length >= limit && limit > 0) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return Promise.all(results);
}
