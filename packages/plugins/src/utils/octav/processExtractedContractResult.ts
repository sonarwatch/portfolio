import { LoggingContext, verboseLog } from './loggingUtils';

export const processExtractedContractResult = <T>(
  result: T,
  functionName: string,
  logCtx: LoggingContext
): T | undefined => {
  if (!result) {
    verboseLog(
      { ...logCtx, functionName, result },
      `Call to ${functionName} returned a falsy result; bailing out`
    );
    return undefined;
  }

  return result;
};
