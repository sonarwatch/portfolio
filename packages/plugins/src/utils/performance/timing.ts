export async function withTiming<T>(
  label: string,
  fn: () => Promise<T>,
  thresholdMs = 0
): Promise<T> {
  const start = Date.now();
  try {
    return await fn();
  } finally {
    const duration = Date.now() - start;
    if (duration >= thresholdMs) {
      console.log(`[Timing] ${label} took ${duration}ms`);
    }
  }
}
