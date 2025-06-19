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

    if (duration >= thresholdMs) {
      console.log(
        `[Timing] ${label} took ${duration}ms, memory: ${memAfter.toFixed(2)}MB total`
      );
    }
  }
}
