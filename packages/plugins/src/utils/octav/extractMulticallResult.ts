import { Abi, ContractFunctionResult } from 'viem';
import { verboseLog } from './loggingUtils';
import { processExtractedContractResult } from './processExtractedContractResult';
import { AbiCallsContext } from './types/abiCallsContext';

export const extractMulticallResult = <
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string
>(
  result: {
    error?: Error;
    status: 'success' | 'failure';
    result?: ContractFunctionResult<TAbi, TFunctionName>;
  },
  params: AbiCallsContext
): ContractFunctionResult<TAbi, TFunctionName> | undefined => {
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

  return processExtractedContractResult(result.result, functionName, logCtx);
};
