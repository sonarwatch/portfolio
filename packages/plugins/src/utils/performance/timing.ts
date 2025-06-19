export async function withTiming<T>(
  label: string,
  fn: () => Promise<T>,
  thresholdMs = 0
): Promise<T> {
  const start = Date.now();
  const memBefore = process.memoryUsage().heapUsed / (1024 * 1024);

  try {
    return await fn();
  } finally {
    const duration = Date.now() - start;
    const memAfter = process.memoryUsage().heapUsed / (1024 * 1024);
    const usage = process.cpuUsage();

    if (duration >= thresholdMs) {
      console.log(
        `[Timing] ${label} took ${duration}ms, memory: ${memAfter.toFixed(
          2
        )}MB total, CPU: user=${usage.user / 1000}ms system=${
          usage.system / 1000
        }ms`
      );
    }
  }
}
