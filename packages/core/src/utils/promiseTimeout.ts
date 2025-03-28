export function promiseTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message?: string
): Promise<T> {
  const timeoutPromise: Promise<T> = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(message || `Promise timed out: ${ms}ms.`));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]);
}
