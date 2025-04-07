import { Abi, ContractFunctionResult } from 'viem';
import { LoggingContext, verboseLog } from './loggingUtils';
import { processExtractedContractResult } from './processExtractedContractResult';
import { MulticallIO } from './types/multicallIO';

/**
 * Convenient one-liner that extracts the result from a MulticallIO object and preserves the strong typing
 * on the returned value.
 */
export const extractMulticallIOResult = <
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string
>(
  result: MulticallIO<TAbi, TFunctionName>,
  params: { logCtx: LoggingContext }
): ContractFunctionResult<TAbi, TFunctionName> | undefined => {
  const { logCtx } = params;
  const { functionName } = result.input;

  verboseLog({ ...logCtx, result }, `Call to ${functionName} completed`);

  if (result.output.error || result.output.status === 'failure') {
    verboseLog(
      {
        ...logCtx,
        input: result.input,
        error: result.output.error,
        status: result.output.status,
      },
      `Error retrieving value from ${functionName}; bailing out`
    );
    return undefined;
  }

  return processExtractedContractResult(
    result.output.result,
    functionName,
    logCtx
  );
};
