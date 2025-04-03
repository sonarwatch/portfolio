import { AbiCallsContext } from './types/abiCallsContext';
import { verboseLog } from './utils/loggingUtils';

export const extractMulticallResult = <T>(
  result: { error?: Error; result?: T; status: 'success' | 'failure' },
  params: AbiCallsContext
): T | undefined => {
  const { functionName, logCtx } = params;

  verboseLog(
    { ...logCtx, functionName, result },
    `Call to ${functionName} completed`
  );

  if (result.error || result.status === 'failure') {
    verboseLog(
      { ...logCtx, functionName, error: result.error, status: result.status },
      `Error retrieving value from ${functionName}; bailing out`
    );
    return undefined;
  }

  if (!result.result) {
    verboseLog(
      { ...logCtx, functionName },
      `Call to ${functionName} returned a falsy result; bailing out`
    );
    return undefined;
  }

  return result.result;
};
