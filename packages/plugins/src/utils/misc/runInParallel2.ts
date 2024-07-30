export async function runInParallel2<T>(
  tasks: (() => Promise<T>)[],
  concurrencyLimit: number
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = [];
  let runningTasks: Promise<void>[] = [];
  let taskIndex = 0;

  async function runNextTask(): Promise<void> {
    if (taskIndex >= tasks.length) return;

    // eslint-disable-next-line no-plusplus
    const currentIndex = taskIndex++;
    try {
      const value = await tasks[currentIndex]();
      results[currentIndex] = { status: 'fulfilled', value };
    } catch (reason) {
      results[currentIndex] = { status: 'rejected', reason };
    }

    runningTasks = runningTasks.filter((t) => t !== runningTasks[0]);
    await runNextTask();
  }

  while (taskIndex < tasks.length || runningTasks.length > 0) {
    if (runningTasks.length < concurrencyLimit && taskIndex < tasks.length) {
      const task = runNextTask();
      runningTasks.push(task);
    } else {
      await Promise.race(runningTasks);
    }
  }

  return results;
}
