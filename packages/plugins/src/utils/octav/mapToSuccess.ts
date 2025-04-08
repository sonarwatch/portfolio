import { MulticallResult } from 'viem';

export function mapToSuccess<T>(
  results: MulticallResult<T>[],
  options: {
    filterErrors?: boolean;
    defaultValue?: T;
    onError?: (error: Error, index: number) => void;
  } = {}
): T[] {
  const { filterErrors = false, defaultValue, onError } = options;
  return results
    .map((result, index) => {
      if (result.status === 'failure') {
        if (onError) {
          onError(result.error, index);
        }
        if (defaultValue !== undefined) {
          return defaultValue;
        }
        if (filterErrors) {
          return null;
        }
        throw result.error;
      }
      return result.result;
    })
    .filter((result): result is T => result !== null);
}
