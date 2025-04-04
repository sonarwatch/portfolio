import { Abi, ContractFunctionResult, ReadContractParameters } from 'viem';

/**
 * A multicallIO is a type that represents the input and output of a multicall.
 * Combining them together allows us to leverage TypeScript strong typing and decrease
 * the amount of copy-pasta code.
 */
export type MulticallIO<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string
> = {
  input: ReadContractParameters<TAbi, TFunctionName>;
  output:
    | {
        error?: Error;
        result: ContractFunctionResult<TAbi, TFunctionName>;
        status: 'success';
      }
    | {
        error: Error;
        result?: undefined;
        status: 'failure';
      };
};
