import {
  Abi,
  PublicClient,
  ReadContractParameters,
  ReadContractReturnType,
} from 'viem';
import { AbiCallsContext } from '../types/abiCallsContext';
import { verboseLog } from './loggingUtils';

export const wrapReadContractCall = async <
  const TAbi extends Abi | readonly unknown[],
  TFunctionName extends string
>(
  client: PublicClient,
  readContractParams: ReadContractParameters<TAbi, TFunctionName>,
  /**
   * We don't want to accept the functionName here because it's already in the readContractParams.
   * This will avoid copy-pasta issues
   */
  params: Omit<AbiCallsContext, 'functionName'>
): Promise<ReadContractReturnType<TAbi, TFunctionName> | undefined> => {
  const { logCtx } = params;
  const { functionName } = readContractParams;

  verboseLog(
    { ...logCtx, readContractParams },
    `Calling readContract() for ${functionName}`
  );
  const result = await client.readContract(readContractParams);
  verboseLog(
    { ...logCtx, functionName, result },
    `Call to ${functionName} completed`
  );

  if (!result) {
    verboseLog(
      { ...logCtx, functionName, result },
      `Call to ${functionName} returned a falsy result; bailing out`
    );
    return undefined;
  }

  return result;
};
